export function parseLiveList<K extends string>(
  envName: string,
  raw: string | undefined,
  validKeys: readonly K[]
): Set<K> {
  const keys = new Set<K>();
  for (const part of (raw ?? "").split(",")) {
    const key = part.trim().toLowerCase();
    if (!key) continue;
    if (!(validKeys as readonly string[]).includes(key)) {
      // A typo here would silently keep real customers on mock data, so stop the build instead.
      throw new Error(
        `${envName}: unknown provider "${key}". Valid values: ${validKeys.join(", ")}`
      );
    }
    keys.add(key as K);
  }
  return keys;
}
