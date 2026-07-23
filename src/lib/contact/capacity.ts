import "server-only";

import {
  Timestamp,
  type DocumentData,
  type Transaction,
} from "firebase-admin/firestore";
import {
  contactDailyQuotaLimit,
  contactQuotaWindowMs,
  readContactQuota,
  reserveContactQuota,
} from "@/lib/contact/quota";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

const contactCapacityReference = () =>
  getFirebaseAdminFirestore().collection("serviceCapacity").doc("contact");

const timestampToMillis = (value: unknown) =>
  value instanceof Timestamp ? value.toMillis() : 0;

const readStoredState = (data: DocumentData | undefined) => ({
  attempts: data?.attempts,
  windowStartedAtMs: timestampToMillis(data?.windowStartedAt),
});

export async function readContactCapacity() {
  const snapshot = await contactCapacityReference().get();
  const quota = readContactQuota(readStoredState(snapshot.data()), Date.now());

  return { available: quota.available };
}

export async function reserveContactCapacity() {
  const db = getFirebaseAdminFirestore();
  const reference = contactCapacityReference();

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const reserved = reserveContactQuota(
      readStoredState(snapshot.data()),
      Date.now(),
    );

    if (!reserved) return { available: false };

    transaction.set(
      reference,
      {
        attempts: reserved.used,
        expiresAt: Timestamp.fromMillis(reserved.resetsAtMs!),
        windowStartedAt: Timestamp.fromMillis(reserved.windowStartedAtMs),
      },
      { merge: true },
    );

    return { available: true, availableAfter: reserved.available };
  });
}

export async function synchronizeContactCapacity(providerUsed: number | null) {
  if (providerUsed === null) return readContactCapacity();

  const db = getFirebaseAdminFirestore();
  const reference = contactCapacityReference();

  return db.runTransaction(async (transaction: Transaction) => {
    const snapshot = await transaction.get(reference);
    const nowMs = Date.now();
    const current = readContactQuota(readStoredState(snapshot.data()), nowMs);
    const used = Math.max(current.used, providerUsed);
    const windowStartedAtMs = current.resetsAtMs
      ? current.windowStartedAtMs
      : nowMs;
    const resetsAtMs = windowStartedAtMs + contactQuotaWindowMs;

    transaction.set(
      reference,
      {
        attempts: used,
        expiresAt: Timestamp.fromMillis(resetsAtMs),
        windowStartedAt: Timestamp.fromMillis(windowStartedAtMs),
      },
      { merge: true },
    );

    return { available: used < contactDailyQuotaLimit };
  });
}

export async function releaseContactCapacity() {
  const db = getFirebaseAdminFirestore();
  const reference = contactCapacityReference();

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    const nowMs = Date.now();
    const current = readContactQuota(readStoredState(snapshot.data()), nowMs);

    if (current.used === 0 || current.resetsAtMs === null) return;

    transaction.set(
      reference,
      {
        attempts: current.used - 1,
        expiresAt: Timestamp.fromMillis(current.resetsAtMs),
        windowStartedAt: Timestamp.fromMillis(current.windowStartedAtMs),
      },
      { merge: true },
    );
  });
}

export async function markContactCapacityUnavailable() {
  const nowMs = Date.now();

  await contactCapacityReference().set(
    {
      attempts: contactDailyQuotaLimit,
      expiresAt: Timestamp.fromMillis(nowMs + contactQuotaWindowMs),
      windowStartedAt: Timestamp.fromMillis(nowMs),
    },
    { merge: true },
  );
}
