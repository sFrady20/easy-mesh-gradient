/**
 * Simple seeded pseudo-random number generator.
 * Implements a Linear Congruential Generator (LCG) for reproducibility.
 *
 * @internal
 */

/**
 * Creates a seeded random number generator function.
 * If no seed is provided, returns Math.random.
 *
 * @param seed - Optional seed string for reproducible randomness
 * @returns A function that returns random numbers between 0 and 1
 * @internal
 */
export function createSeededRNG(seed?: string): () => number {
  if (!seed) {
    return Math.random;
  }

  // Convert seed string to a number
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and ensure positive
  let state = Math.abs(hash) || 1;

  // Linear Congruential Generator parameters
  // Using values from Numerical Recipes
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);

  return function seededRandom(): number {
    state = (a * state + c) % m;
    return state / m;
  };
}
