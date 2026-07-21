import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAppCheck } from "firebase-admin/app-check";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { firebaseEmulatorConfig } from "@/lib/firebase/emulator-config";

function requireServerEnvironmentVariable(
  name: string,
  value: string | undefined,
) {
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function isFirebaseAdminEmulatorMode() {
  return process.env.NODE_ENV === "development";
}

function isVercelProductionEnvironment() {
  return (
    process.env.VERCEL === "1" &&
    process.env.VERCEL_ENV === "production" &&
    Boolean(process.env.VERCEL_URL)
  );
}

function configureFirebaseAdminEmulators() {
  const expectedEnvironment = {
    FIREBASE_AUTH_EMULATOR_HOST: firebaseEmulatorConfig.authHost,
    FIRESTORE_EMULATOR_HOST: firebaseEmulatorConfig.firestoreHost,
    GCLOUD_PROJECT: firebaseEmulatorConfig.projectId,
  } as const;

  for (const [name, expectedValue] of Object.entries(expectedEnvironment)) {
    const currentValue = process.env[name];

    if (currentValue && currentValue !== expectedValue) {
      throw new Error(`${name} must point to the local demo environment`);
    }

    process.env[name] = expectedValue;
  }
}

export function getFirebaseAdminApp(): App {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  if (isFirebaseAdminEmulatorMode()) {
    configureFirebaseAdminEmulators();

    return initializeApp({ projectId: firebaseEmulatorConfig.projectId });
  }

  if (!isVercelProductionEnvironment()) {
    throw new Error(
      "Firebase Admin access is disabled outside local development and Vercel Production",
    );
  }

  const projectId = requireServerEnvironmentVariable(
    "FIREBASE_PROJECT_ID",
    process.env.FIREBASE_PROJECT_ID,
  );
  const publicProjectId = requireServerEnvironmentVariable(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  );

  if (projectId !== publicProjectId) {
    throw new Error("Firebase client and Admin project IDs do not match");
  }

  const clientEmail = requireServerEnvironmentVariable(
    "FIREBASE_CLIENT_EMAIL",
    process.env.FIREBASE_CLIENT_EMAIL,
  );
  const privateKey = requireServerEnvironmentVariable(
    "FIREBASE_PRIVATE_KEY",
    process.env.FIREBASE_PRIVATE_KEY,
  );
  const credential = cert({
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  });

  return initializeApp({
    credential,
    projectId,
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminAppCheck() {
  return getAppCheck(getFirebaseAdminApp());
}

export function getFirebaseAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}
