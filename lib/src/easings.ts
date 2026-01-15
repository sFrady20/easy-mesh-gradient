/**
 * Collection of easing functions for gradient transitions.
 * All functions accept a value between 0 and 1 and return a value between 0 and 1.
 *
 * @public
 */

/**
 * Linear easing - no acceleration or deceleration.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function linear(x: number): number {
  return x;
}

/**
 * Ease in quadratic - slow start, accelerating.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeInQuad(x: number): number {
  return x * x;
}

/**
 * Ease out quadratic - fast start, decelerating.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

/**
 * Ease in-out quadratic - slow start and end, fast middle.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/**
 * Ease in cubic - slow start, accelerating.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeInCubic(x: number): number {
  return x * x * x;
}

/**
 * Ease out cubic - fast start, decelerating.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

/**
 * Ease in-out cubic - slow start and end, fast middle.
 * This is the default easing function.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Ease in-out sine - smooth, natural motion.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

/**
 * Ease in-out exponential - very smooth, dramatic transitions.
 *
 * @param x - Input value between 0 and 1
 * @returns Output value between 0 and 1
 * @public
 */
export function easeInOutExpo(x: number): number {
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;
}
