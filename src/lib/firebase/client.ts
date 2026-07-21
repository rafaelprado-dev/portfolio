import "client-only";

import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import {
  getLimitedUseToken,
  getToken,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from "firebase/app-check";
import {
  connectAuthEmulator,
  getAuth,
  signInAnonymously,
  type Auth,
  type User,
} from "firebase/auth";
import { firebaseEmulatorConfig } from "@/lib/firebase/emulator-config";

type FirebaseRequestHeaderOptions = {
  limitedUseAppCheckToken?: boolean;
};

let anonymousUserPromise: Promise<User> | undefined;

declare global {
  var __rafaelPortfolioFirebaseAppCheck: AppCheck | undefined;
  var __rafaelPortfolioFirebaseAuth: Auth | undefined;
}

type FirebaseClientEnvironment = "disabled" | "emulator" | "production";

function getFirebaseClientEnvironment(): FirebaseClientEnvironment {
  switch (process.env.NEXT_PUBLIC_DEPLOYMENT_ENV) {
    case "development":
      return "emulator";
    case "production":
      return "production";
    default:
      return "disabled";
  }
}

function requirePublicEnvironmentVariable(
  name: string,
  value: string | undefined,
) {
  if (!value) {
    throw new Error(`Missing required public environment variable: ${name}`);
  }

  return value;
}

function getFirebaseClientOptions(): FirebaseOptions {
  const environment = getFirebaseClientEnvironment();

  if (environment === "emulator") {
    return {
      apiKey: "demo-api-key",
      authDomain: `${firebaseEmulatorConfig.projectId}.firebaseapp.com`,
      projectId: firebaseEmulatorConfig.projectId,
      appId: "1:000000000000:web:local",
    };
  }

  if (environment !== "production") {
    throw new Error(
      "Firebase is disabled outside local development and production",
    );
  }

  return {
    apiKey: requirePublicEnvironmentVariable(
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    ),
    authDomain: requirePublicEnvironmentVariable(
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    ),
    projectId: requirePublicEnvironmentVariable(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    ),
    appId: requirePublicEnvironmentVariable(
      "NEXT_PUBLIC_FIREBASE_APP_ID",
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    ),
  };
}

export function getFirebaseClientApp(): FirebaseApp {
  return getApps().length > 0
    ? getApp()
    : initializeApp(getFirebaseClientOptions());
}

function getFirebaseClientAuth(): Auth {
  if (globalThis.__rafaelPortfolioFirebaseAuth) {
    return globalThis.__rafaelPortfolioFirebaseAuth;
  }

  const auth = getAuth(getFirebaseClientApp());

  if (getFirebaseClientEnvironment() === "emulator") {
    connectAuthEmulator(auth, firebaseEmulatorConfig.authUrl, {
      disableWarnings: true,
    });
  }

  globalThis.__rafaelPortfolioFirebaseAuth = auth;

  return auth;
}

function getFirebaseClientAppCheck(): AppCheck {
  if (globalThis.__rafaelPortfolioFirebaseAppCheck) {
    return globalThis.__rafaelPortfolioFirebaseAppCheck;
  }

  if (getFirebaseClientEnvironment() !== "production") {
    throw new Error("App Check is available only in production");
  }

  const app = getFirebaseClientApp();
  const siteKey = requirePublicEnvironmentVariable(
    "NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY",
    process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY,
  );

  globalThis.__rafaelPortfolioFirebaseAppCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });

  return globalThis.__rafaelPortfolioFirebaseAppCheck;
}

export async function getAnonymousFirebaseUser(): Promise<User> {
  const auth = getFirebaseClientAuth();

  if (auth.currentUser) {
    return auth.currentUser;
  }

  anonymousUserPromise ??= signInAnonymously(auth).then(({ user }) => user);

  try {
    return await anonymousUserPromise;
  } finally {
    anonymousUserPromise = undefined;
  }
}

export async function createFirebaseRequestHeaders({
  limitedUseAppCheckToken = false,
}: FirebaseRequestHeaderOptions = {}) {
  const environment = getFirebaseClientEnvironment();
  const user = await getAnonymousFirebaseUser();

  if (environment === "emulator") {
    return {
      Authorization: `Bearer ${await user.getIdToken()}`,
    };
  }

  const appCheck = getFirebaseClientAppCheck();

  const [idToken, appCheckToken] = await Promise.all([
    user.getIdToken(),
    limitedUseAppCheckToken ? getLimitedUseToken(appCheck) : getToken(appCheck),
  ]);

  return {
    Authorization: `Bearer ${idToken}`,
    "X-Firebase-AppCheck": appCheckToken.token,
  };
}
