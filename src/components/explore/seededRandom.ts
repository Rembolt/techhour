/**
 * Seeded random number generator (mulberry32).
 *
 * Each call to the returned function gives the next number in a sequence
 * that starts from the seed. Same seed, same sequence, so the Explore layout
 * looks random but is identical on every load.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
