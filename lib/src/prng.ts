/**
 * Creates a seeded random number generator function.
 * If no seed is provided, returns Math.random.
 *
 * Uses an xmur3 string hash to seed a mulberry32 generator,
 * giving well-distributed, reproducible values for any seed string.
 *
 * @param seed - Optional seed string for reproducible randomness
 * @returns A function that returns random numbers in [0, 1)
 * @internal
 */
export function createSeededRNG(seed?: string): () => number {
  if (!seed) {
    return Math.random;
  }

  // xmur3 string hash
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  let state = (h ^= h >>> 16) >>> 0;

  // mulberry32
  return function seededRandom(): number {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
