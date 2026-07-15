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
import { getAuth, signInAnonymously, type User } from "firebase/auth";

type FirebaseRequestHeaderOptions = {
  limitedUseAppCheckToken?: boolean;
};

let anonymousUserPromise: Promise<User> | undefined;

declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
  var __rafaelPortfolioFirebaseAppCheck: AppCheck | undefined;
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

function getFirebaseClientAppCheck(): AppCheck {
  if (globalThis.__rafaelPortfolioFirebaseAppCheck) {
    return globalThis.__rafaelPortfolioFirebaseAppCheck;
  }

  const app = getFirebaseClientApp();

  if (
    process.env.NODE_ENV === "development" &&
    globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN === undefined
  ) {
    globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

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
  const auth = getAuth(getFirebaseClientApp());

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
  const appCheck = getFirebaseClientAppCheck();
  const user = await getAnonymousFirebaseUser();

  const [idToken, appCheckToken] = await Promise.all([
    user.getIdToken(),
    limitedUseAppCheckToken ? getLimitedUseToken(appCheck) : getToken(appCheck),
  ]);

  return {
    Authorization: `Bearer ${idToken}`,
    "X-Firebase-AppCheck": appCheckToken.token,
  };
}
