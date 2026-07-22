"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CommunityMessage } from "@/lib/community/contracts";

const feedbackOrderStorageKey = "rafael-portfolio.feedback.carousel-order.v1";

const shuffleIds = (ids: string[], previousId?: string) => {
  const shuffled = [...ids];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  if (shuffled.length > 1 && shuffled[0] === previousId) {
    const swapIndex = 1 + Math.floor(Math.random() * (shuffled.length - 1));
    [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
  }

  return shuffled;
};

const readStoredOrder = () => {
  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(feedbackOrderStorageKey) ?? "[]",
    ) as unknown;

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const storeOrder = (order: string[]) => {
  window.sessionStorage.setItem(feedbackOrderStorageKey, JSON.stringify(order));
};

const reconcileOrder = (current: string[], available: string[]) => {
  const availableIds = new Set(available);
  const seenIds = new Set<string>();
  const retained = current.filter((id) => {
    if (!availableIds.has(id) || seenIds.has(id)) return false;

    seenIds.add(id);
    return true;
  });
  const added = available.filter((id) => !seenIds.has(id));

  return retained.length
    ? [...retained, ...shuffleIds(added)]
    : shuffleIds(added);
};

const ordersMatch = (first: string[], second: string[]) =>
  first.length === second.length &&
  first.every((id, index) => id === second[index]);

type FeedbackCarouselOptions = {
  approvedMessages: CommunityMessage[];
  isPaused: boolean;
  loading: boolean;
  pendingMessages: CommunityMessage[];
};

export function useFeedbackCarousel({
  approvedMessages,
  isPaused,
  loading,
  pendingMessages,
}: FeedbackCarouselOptions) {
  const [approvedOrder, setApprovedOrder] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readStoredOrder(),
  );
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [knownMessageIds, setKnownMessageIds] = useState({
    approved: [] as string[],
    pending: [] as string[],
  });
  const approvedIds = useMemo(
    () => approvedMessages.map((message) => message.id),
    [approvedMessages],
  );
  const pendingIds = useMemo(
    () => pendingMessages.map((message) => message.id),
    [pendingMessages],
  );
  const approvedById = useMemo(
    () => new Map(approvedMessages.map((message) => [message.id, message])),
    [approvedMessages],
  );
  const orderedMessages = useMemo(
    () => [
      ...pendingMessages,
      ...approvedOrder.flatMap((id) => {
        const message = approvedById.get(id);
        return message ? [message] : [];
      }),
    ],
    [approvedById, approvedOrder, pendingMessages],
  );

  if (
    !loading &&
    (!ordersMatch(knownMessageIds.approved, approvedIds) ||
      !ordersMatch(knownMessageIds.pending, pendingIds))
  ) {
    const knownPendingIds = new Set(knownMessageIds.pending);
    const newPendingMessage = pendingMessages.find(
      (message) => !knownPendingIds.has(message.id),
    );
    const nextOrder = reconcileOrder(approvedOrder, approvedIds);
    const availableIds = new Set([...pendingIds, ...approvedIds]);

    setKnownMessageIds({ approved: approvedIds, pending: pendingIds });

    if (!ordersMatch(approvedOrder, nextOrder)) setApprovedOrder(nextOrder);

    if (newPendingMessage) {
      setActiveMessageId(newPendingMessage.id);
    } else if (activeMessageId && !availableIds.has(activeMessageId)) {
      setActiveMessageId(null);
    }
  }

  const activeIndex = orderedMessages.findIndex(
    (message) => message.id === activeMessageId,
  );
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeMessage = orderedMessages[safeActiveIndex];

  useEffect(() => {
    if (loading) return;

    if (!approvedOrder.length) {
      window.sessionStorage.removeItem(feedbackOrderStorageKey);
      return;
    }

    storeOrder(approvedOrder);
  }, [approvedOrder, loading]);

  const showPrevious = useCallback(() => {
    if (orderedMessages.length <= 1) return;

    const previousIndex =
      (safeActiveIndex - 1 + orderedMessages.length) % orderedMessages.length;
    setActiveMessageId(orderedMessages[previousIndex].id);
  }, [orderedMessages, safeActiveIndex]);

  const showNext = useCallback(() => {
    if (orderedMessages.length <= 1) return;

    if (safeActiveIndex < orderedMessages.length - 1) {
      setActiveMessageId(orderedMessages[safeActiveIndex + 1].id);
      return;
    }

    if (approvedOrder.length > 1) {
      const nextOrder = shuffleIds(
        approvedOrder,
        approvedOrder[approvedOrder.length - 1],
      );

      storeOrder(nextOrder);
      setApprovedOrder(nextOrder);
      setActiveMessageId(pendingMessages[0]?.id ?? nextOrder[0]);
      return;
    }

    setActiveMessageId(orderedMessages[0].id);
  }, [approvedOrder, orderedMessages, pendingMessages, safeActiveIndex]);

  useEffect(() => {
    if (orderedMessages.length <= 1 || isPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(showNext, 7_000);

    return () => window.clearInterval(timer);
  }, [isPaused, orderedMessages.length, showNext]);

  return {
    activeMessage,
    messages: orderedMessages,
    safeActiveIndex,
    showNext,
    showPrevious,
  };
}
