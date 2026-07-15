import { readFile } from "node:fs/promises";
import { after, before, beforeEach, describe, test } from "node:test";
import {
  assertFails,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

const projectId = "demo-portfolio";
const protectedPaths = [
  "feedback/example",
  "gameSessions/example",
  "leaderboards/example",
  "siteStats/global",
  "visitors/example",
  "unexpected/private",
];

let testEnvironment;

before(async () => {
  const rules = await readFile(
    new URL("../firestore.rules", import.meta.url),
    "utf8",
  );

  testEnvironment = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
});

after(async () => {
  await testEnvironment.cleanup();
});

describe("Cloud Firestore security rules", () => {
  test("deny every unauthenticated client read and write", async () => {
    const firestore = testEnvironment.unauthenticatedContext().firestore();

    for (const path of protectedPaths) {
      const reference = doc(firestore, path);

      await assertFails(getDoc(reference));
      await assertFails(setDoc(reference, { test: true }));
    }
  });

  test("deny every authenticated client read and write", async () => {
    const firestore = testEnvironment
      .authenticatedContext("anonymous-user", {
        firebase: { sign_in_provider: "anonymous" },
      })
      .firestore();

    for (const path of protectedPaths) {
      const reference = doc(firestore, path);

      await assertFails(getDoc(reference));
      await assertFails(setDoc(reference, { test: true }));
    }
  });
});
