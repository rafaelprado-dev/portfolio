import "server-only";

import {
  getFirebaseAdminAppCheck,
  getFirebaseAdminAuth,
  isFirebaseAdminEmulatorMode,
} from "@/lib/firebase/admin";
import { firebaseEmulatorConfig } from "@/lib/firebase/emulator-config";

type FirebaseRequestVerificationOptions = {
  consumeAppCheckToken?: boolean;
};

export class FirebaseRequestVerificationError extends Error {
  readonly status = 401;

  constructor() {
    super("Unauthorized Firebase request");
    this.name = "FirebaseRequestVerificationError";
  }
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new FirebaseRequestVerificationError();
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    throw new FirebaseRequestVerificationError();
  }

  return token;
}

function getAppCheckToken(request: Request) {
  const token = request.headers.get("x-firebase-appcheck")?.trim();

  if (!token) {
    throw new FirebaseRequestVerificationError();
  }

  return token;
}

export async function verifyFirebaseRequest(
  request: Request,
  { consumeAppCheckToken = false }: FirebaseRequestVerificationOptions = {},
) {
  const idToken = getBearerToken(request);

  try {
    if (isFirebaseAdminEmulatorMode()) {
      const authenticatedUser =
        await getFirebaseAdminAuth().verifyIdToken(idToken);

      if (authenticatedUser.firebase?.sign_in_provider !== "anonymous") {
        throw new FirebaseRequestVerificationError();
      }

      return {
        uid: authenticatedUser.uid,
        appId: firebaseEmulatorConfig.projectId,
      };
    }

    const appCheckToken = getAppCheckToken(request);
    const [authenticatedUser, verifiedApp] = await Promise.all([
      getFirebaseAdminAuth().verifyIdToken(idToken, true),
      getFirebaseAdminAppCheck().verifyToken(appCheckToken, {
        consume: consumeAppCheckToken,
      }),
    ]);

    const expectedAppId =
      process.env.FIREBASE_WEB_APP_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    const signInProvider = authenticatedUser.firebase?.sign_in_provider;

    if (
      !expectedAppId ||
      signInProvider !== "anonymous" ||
      verifiedApp.appId !== expectedAppId ||
      verifiedApp.alreadyConsumed
    ) {
      throw new FirebaseRequestVerificationError();
    }

    return {
      uid: authenticatedUser.uid,
      appId: verifiedApp.appId,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Firebase request verification failed", error);
    }

    throw new FirebaseRequestVerificationError();
  }
}
