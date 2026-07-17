import {
  applicationDefault,
  cert,
  deleteApp,
  initializeApp,
} from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFile } from "node:fs/promises";

const collectionName = "rateLimits";
const batchSize = 500;
const maximumDeletesPerRun = 5_000;

const isApplyMode = process.argv.slice(2).includes("--apply");
const unknownArguments = process.argv
  .slice(2)
  .filter((argument) => argument !== "--apply");

if (unknownArguments.length > 0) {
  throw new Error(`Unknown argument: ${unknownArguments.join(", ")}`);
}

const firebaseConfig = JSON.parse(
  await readFile(new URL("../.firebaserc", import.meta.url), "utf8"),
);
const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  firebaseConfig.projects?.default;

if (!projectId) {
  throw new Error(
    "Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  );
}

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const credential =
  clientEmail && privateKey
    ? cert({
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
        projectId,
      })
    : applicationDefault();
const app = initializeApp({ credential, projectId });
const db = getFirestore(app);
const expiredQuery = db
  .collection(collectionName)
  .where("expiresAt", "<=", Timestamp.now());
const expiredCount = (await expiredQuery.count().get()).data().count;

console.log(`Project: ${projectId}`);
console.log(`Collection: ${collectionName}`);
console.log(`Expired documents: ${expiredCount}`);

if (!isApplyMode) {
  console.log("Dry run only. Run with --apply to delete expired documents.");
} else {
  let deletedCount = 0;

  while (deletedCount < maximumDeletesPerRun) {
    const remainingCapacity = maximumDeletesPerRun - deletedCount;
    const snapshot = await expiredQuery
      .orderBy("expiresAt")
      .limit(Math.min(batchSize, remainingCapacity))
      .get();

    if (snapshot.empty) break;

    const batch = db.batch();

    for (const document of snapshot.docs) {
      batch.delete(document.ref);
    }

    await batch.commit();
    deletedCount += snapshot.size;
  }

  console.log(`Deleted documents: ${deletedCount}`);

  if (expiredCount > deletedCount) {
    console.log(
      `Safety limit reached. Run the command again to remove the remaining ${expiredCount - deletedCount} documents.`,
    );
  }
}

await deleteApp(app);
