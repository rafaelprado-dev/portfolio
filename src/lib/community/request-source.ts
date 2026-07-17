import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import type { CommunityMutationAction } from "./rate-limit";

const forwardedAddressHeaders = [
  "x-vercel-forwarded-for",
  "x-forwarded-for",
  "x-real-ip",
] as const;

const normalizeForwardedAddress = (value: string | null) => {
  const address = value?.split(",", 1)[0]?.trim();

  return address && isIP(address) ? address : null;
};

export function resolveRequestSource(
  headers: Headers,
  allowDevelopmentFallback = false,
) {
  for (const header of forwardedAddressHeaders) {
    const address = normalizeForwardedAddress(headers.get(header));

    if (address) return address;
  }

  if (allowDevelopmentFallback) return "local-development";

  return null;
}

export function hashRequestSource(
  source: string,
  action: CommunityMutationAction,
  salt: string,
) {
  return createHmac("sha256", salt)
    .update(`community-source:${action}\0${source}`)
    .digest("hex");
}
