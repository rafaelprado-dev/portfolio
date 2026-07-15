export const communityAvatarCount = 24;

export const isCommunityAvatarId = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 1 &&
  value <= communityAvatarCount;

export const createRandomCommunityAvatarId = (
  currentAvatarId?: number | null,
) => {
  const current = isCommunityAvatarId(currentAvatarId) ? currentAvatarId : null;
  const availableCount = current
    ? communityAvatarCount - 1
    : communityAvatarCount;
  const randomValues = new Uint32Array(1);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(randomValues);
  } else {
    randomValues[0] = Math.floor(Math.random() * 2 ** 32);
  }

  const candidate = (randomValues[0] % availableCount) + 1;

  return current && candidate >= current ? candidate + 1 : candidate;
};

const hashText = (value: string) => {
  let hash = 2_166_136_261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }

  return hash >>> 0;
};

export const normalizeCommunityAvatarId = (
  value: unknown,
  fallbackSeed = "rsn-visitor",
) => {
  if (isCommunityAvatarId(value)) {
    return value;
  }

  return (hashText(fallbackSeed) % communityAvatarCount) + 1;
};

export const getCommunityAvatarPath = (avatarId: number) =>
  `/assets/avatars/rsn/avatar-${String(normalizeCommunityAvatarId(avatarId)).padStart(2, "0")}.svg`;
