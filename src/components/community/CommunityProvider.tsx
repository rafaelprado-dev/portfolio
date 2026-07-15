"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type CommunityMessage,
  type CommunitySnapshot,
  type FeedbackInput,
  type GameSubmissionResult,
  type LeaderboardEntry,
} from "@/lib/community/contracts";
import {
  createRandomCommunityAvatarId,
  isCommunityAvatarId,
  normalizeCommunityAvatarId,
} from "@/lib/community/avatars";
import { createFirebaseRequestHeaders } from "@/lib/firebase/client";

const pendingFeedbackStorageKey = "rafael-portfolio.feedback.pending.v1";
const publicAvatarStorageKey = "rafael-portfolio.community.avatar.v1";
const publicNameStorageKey = "rafael-portfolio.community.name.v1";
const submittedSnakeScoreStorageKey =
  "rafael-portfolio.snake.submitted-best.v1";
const visitSessionStorageKey = "rafael-portfolio.community.visit.v1";

const emptySnapshot: CommunitySnapshot = {
  feedback: [],
  visitorCount: 0,
  snakeLeaderboard: [],
  doomLeaderboard: [],
};

type CommunityContextValue = CommunitySnapshot & {
  changeDisplayAvatar: () => void;
  displayAvatarId: number | null;
  displayName: string;
  messages: CommunityMessage[];
  pendingMessages: CommunityMessage[];
  loading: boolean;
  setDisplayName: (name: string) => void;
  submitFeedback: (input: FeedbackInput) => Promise<CommunityMessage>;
  submitSnakeScore: (score: number) => Promise<void>;
  reportDoomTime: (seconds: number) => Promise<void>;
  refreshCommunity: () => Promise<void>;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

const readPendingFeedback = () => {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(pendingFeedbackStorageKey) ?? "[]",
    ) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is CommunityMessage =>
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.message === "string" &&
          typeof item.createdAt === "string" &&
          item.status === "pending",
      )
      .map((item) => ({
        ...item,
        avatarId: normalizeCommunityAvatarId(item.avatarId, item.id),
      }))
      .slice(0, 5);
  } catch {
    return [];
  }
};

const upsertLeaderboardEntry = (
  entries: LeaderboardEntry[],
  entry: LeaderboardEntry,
) =>
  [...entries.filter((item) => item.id !== entry.id), entry]
    .sort((first, second) => second.value - first.value)
    .slice(0, 10);

async function requestCommunityApi<T>(
  path: string,
  options: {
    body?: unknown;
    limitedUseAppCheckToken?: boolean;
    method?: "GET" | "POST";
  } = {},
) {
  const method = options.method ?? "GET";
  const headers =
    method === "POST"
      ? await createFirebaseRequestHeaders({
          limitedUseAppCheckToken: options.limitedUseAppCheckToken,
        })
      : {};
  const response = await fetch(path, {
    method,
    headers: {
      ...headers,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as
    (T & { error?: string }) | null;

  if (!response.ok) {
    throw new Error(
      payload?.error ?? "Não foi possível concluir a solicitação",
    );
  }

  if (!payload) {
    throw new Error("O servidor retornou uma resposta inválida");
  }

  return payload;
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<CommunitySnapshot>(emptySnapshot);
  const [pendingFeedback, setPendingFeedback] = useState<CommunityMessage[]>(
    [],
  );
  const [displayAvatarId, setDisplayAvatarId] = useState<number | null>(null);
  const [displayName, setDisplayNameState] = useState("");
  const [loading, setLoading] = useState(true);
  const submittedSnakeBestRef = useRef(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setPendingFeedback(readPendingFeedback());
      const storedName =
        window.localStorage.getItem(publicNameStorageKey)?.trim() ?? "";

      const normalizedName = storedName === "Jogador" ? "" : storedName;
      const storedAvatarId = Number(
        window.localStorage.getItem(publicAvatarStorageKey),
      );

      setDisplayNameState(normalizedName);

      if (isCommunityAvatarId(storedAvatarId)) {
        setDisplayAvatarId(storedAvatarId);
      } else if (normalizedName) {
        const avatarId = createRandomCommunityAvatarId();

        setDisplayAvatarId(avatarId);
        window.localStorage.setItem(publicAvatarStorageKey, String(avatarId));
      }
      submittedSnakeBestRef.current = Number(
        window.localStorage.getItem(submittedSnakeScoreStorageKey) ?? "0",
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const refreshCommunity = useCallback(async () => {
    const nextSnapshot =
      await requestCommunityApi<CommunitySnapshot>("/api/community");

    setSnapshot(nextSnapshot);
    setPendingFeedback((current) => {
      const approvedIds = new Set(nextSnapshot.feedback.map((item) => item.id));
      const next = current.filter((item) => !approvedIds.has(item.id));

      window.localStorage.setItem(
        pendingFeedbackStorageKey,
        JSON.stringify(next),
      );

      return next;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeCommunity = async () => {
      const tasks: Promise<unknown>[] = [refreshCommunity()];

      if (!window.sessionStorage.getItem(visitSessionStorageKey)) {
        tasks.push(
          requestCommunityApi<{ visitorCount: number }>(
            "/api/community/visit",
            {
              method: "POST",
              limitedUseAppCheckToken: true,
            },
          ).then(({ visitorCount }) => {
            window.sessionStorage.setItem(visitSessionStorageKey, "registered");

            if (!cancelled) {
              setSnapshot((current) => ({ ...current, visitorCount }));
            }
          }),
        );
      }

      await Promise.allSettled(tasks);

      if (!cancelled) {
        setLoading(false);
      }
    };

    void initializeCommunity();

    return () => {
      cancelled = true;
    };
  }, [refreshCommunity]);

  const setDisplayName = useCallback((name: string) => {
    setDisplayNameState(name);

    if (name.trim()) {
      window.localStorage.setItem(publicNameStorageKey, name.trim());
      setDisplayAvatarId((current) => {
        if (current) return current;

        const avatarId = createRandomCommunityAvatarId();
        window.localStorage.setItem(publicAvatarStorageKey, String(avatarId));

        return avatarId;
      });
    } else {
      window.localStorage.removeItem(publicNameStorageKey);
    }
  }, []);

  const changeDisplayAvatar = useCallback(() => {
    setDisplayAvatarId((current) => {
      const avatarId = createRandomCommunityAvatarId(current);

      window.localStorage.setItem(publicAvatarStorageKey, String(avatarId));

      return avatarId;
    });
  }, []);

  const submitFeedback = useCallback(
    async (input: FeedbackInput) => {
      const { feedback } = await requestCommunityApi<{
        feedback: CommunityMessage;
      }>("/api/feedback", {
        body: input,
        limitedUseAppCheckToken: true,
        method: "POST",
      });

      setDisplayName(input.name);
      setPendingFeedback((current) => {
        const next = [
          feedback,
          ...current.filter((item) => item.id !== feedback.id),
        ].slice(0, 5);

        window.localStorage.setItem(
          pendingFeedbackStorageKey,
          JSON.stringify(next),
        );

        return next;
      });

      return feedback;
    },
    [setDisplayName],
  );

  const submitSnakeScore = useCallback(
    async (score: number) => {
      if (score <= submittedSnakeBestRef.current) return;

      const { entry } = await requestCommunityApi<GameSubmissionResult>(
        "/api/games/snake",
        {
          body: { name: displayName.trim() || "Visitante", score },
          limitedUseAppCheckToken: true,
          method: "POST",
        },
      );

      submittedSnakeBestRef.current = entry.value;
      window.localStorage.setItem(
        submittedSnakeScoreStorageKey,
        String(entry.value),
      );
      setSnapshot((current) => ({
        ...current,
        snakeLeaderboard: upsertLeaderboardEntry(
          current.snakeLeaderboard,
          entry,
        ),
      }));
    },
    [displayName],
  );

  const reportDoomTime = useCallback(
    async (seconds: number) => {
      if (seconds < 5) return;

      const { entry } = await requestCommunityApi<GameSubmissionResult>(
        "/api/games/doom",
        {
          body: { name: displayName.trim() || "Visitante", seconds },
          limitedUseAppCheckToken: true,
          method: "POST",
        },
      );

      setSnapshot((current) => ({
        ...current,
        doomLeaderboard: upsertLeaderboardEntry(current.doomLeaderboard, entry),
      }));
    },
    [displayName],
  );

  const messages = useMemo(
    () => [...pendingFeedback, ...snapshot.feedback],
    [pendingFeedback, snapshot.feedback],
  );
  const value = useMemo<CommunityContextValue>(
    () => ({
      ...snapshot,
      changeDisplayAvatar,
      displayAvatarId,
      displayName,
      loading,
      messages,
      pendingMessages: pendingFeedback,
      refreshCommunity,
      reportDoomTime,
      setDisplayName,
      submitFeedback,
      submitSnakeScore,
    }),
    [
      changeDisplayAvatar,
      displayAvatarId,
      displayName,
      loading,
      messages,
      pendingFeedback,
      refreshCommunity,
      reportDoomTime,
      setDisplayName,
      snapshot,
      submitFeedback,
      submitSnakeScore,
    ],
  );

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);

  if (!context) {
    throw new Error("useCommunity must be used within CommunityProvider");
  }

  return context;
}
