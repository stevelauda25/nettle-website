/**
 * Spring → `linear()` easing.
 *
 * A designer tunes a spring as a perceptual duration and a bounce; production
 * ships plain CSS. This samples the closed-form damped spring at even steps and
 * emits a `linear(...)` timing function plus the duration the animation should
 * run for, the same technique the design-system docs already use for their
 * sidebar indicator.
 *
 * `bounce` follows the common convention: 0 is critically damped (no overshoot),
 * values toward 1 overshoot more. Pure function, no DOM.
 */
export type LinearSpring = {
  /** CSS `linear(...)` timing function. */
  easing: string;
  /** Seconds the animation should run so the spring visibly settles. */
  duration: number;
};

export function springToLinear(visualDuration: number, bounce: number, samples = 24): LinearSpring {
  const duration = Math.max(0.05, visualDuration);
  const zeta = 1 - Math.min(Math.max(bounce, 0), 0.99);
  const omega = (2 * Math.PI) / duration;
  // Settle a little past the perceptual duration so the tail reads as rest.
  const settle = duration * (bounce > 0 ? 1.6 : 1.25);

  const position = (t: number) => {
    if (zeta >= 1) {
      // Critically damped: 1 - e^(-ωt)(1 + ωt)
      return 1 - Math.exp(-omega * t) * (1 + omega * t);
    }
    const omegaD = omega * Math.sqrt(1 - zeta * zeta);
    return (
      1 -
      Math.exp(-zeta * omega * t) *
        (Math.cos(omegaD * t) + ((zeta * omega) / omegaD) * Math.sin(omegaD * t))
    );
  };

  const stops: string[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * settle;
    const value = i === samples ? 1 : position(t);
    stops.push(Number(value.toFixed(4)).toString());
  }

  return { easing: `linear(${stops.join(", ")})`, duration: Number(settle.toFixed(3)) };
}
