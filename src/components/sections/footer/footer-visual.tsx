import Image from "next/image";

/**
 * Figma 415:4771 is a flattened image, including its outlined Nettle logo.
 * Original PNG: 1440 × 562, SHA-1 06fa881f51d2b0ffbe8c22e8b6f0933fc18f66c3.
 * Serve those exact bytes: no re-encoding or generated upscaled variants.
 * Render edge-to-edge at every viewport width, preserving the full composition.
 * Wider/high-DPI displays still need a higher-resolution original for sharpness.
 */
export function FooterVisual() {
  return (
    <div aria-hidden="true" data-slot="footer-visual" className="w-full">
      <Image
        src="/assets/images/footer/footer-visual.png"
        alt=""
        width={1440}
        height={562}
        sizes="100vw"
        unoptimized
        loading="lazy"
        className="pointer-events-none block h-auto w-full select-none"
      />
    </div>
  );
}
