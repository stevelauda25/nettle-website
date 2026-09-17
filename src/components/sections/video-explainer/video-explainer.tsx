import Image from "next/image";
import { Container, Grid } from "@/components/layout/grid";
import styles from "./video-explainer.module.css";

// Figma: Video Explainer (392:6904). A 1144×644 video poster on columns 2–11.
// Figma shows the poster and play control only — no video source or playback
// behavior is defined, so the play control is visual.
//
// SCROLL STORYBOARD (CSS only, motion-safe + supported browsers):
// Mobile: enter at 95%, pin the symmetrically padded stage below the header,
//         scale to 100% over 20svh, then release.
//         The compact track/pin range lives in the CSS module.
// md+:    entry 0% → contain 60%, scale 75% → 100%, then hold while pinned.
//         Preserve the existing 200svh track and viewport-height stage.
// Reduced motion / unsupported browsers: static full-size poster, no pinning.
const scrollTrack =
  "[view-timeline-name:--video-explainer] md:motion-safe:supports-[animation-timeline:view()]:h-[200svh] md:motion-safe:supports-[animation-timeline:view()]:py-0";

const scrollStage =
  "md:motion-safe:supports-[animation-timeline:view()]:sticky md:motion-safe:supports-[animation-timeline:view()]:top-0 md:motion-safe:supports-[animation-timeline:view()]:flex md:motion-safe:supports-[animation-timeline:view()]:h-svh md:motion-safe:supports-[animation-timeline:view()]:items-center md:motion-safe:supports-[animation-timeline:view()]:pt-21";

const scrollScale =
  "[--scroll-scale-from:0.95] md:[--scroll-scale-from:0.75] motion-safe:supports-[animation-timeline:view()]:will-change-[scale] motion-safe:supports-[animation-timeline:view()]:animate-scroll-scale-in motion-safe:supports-[animation-timeline:view()]:[animation-timeline:--video-explainer] md:motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_contain_60%]";

export function VideoExplainer() {
  return (
    <section aria-label="Nettle explainer video" className={`relative bg-white py-(--space-section-media) ${scrollTrack} ${styles.section}`}>
      <div data-slot="video-stage" className={`w-full ${scrollStage} ${styles.stage}`}>
        <Container>
          <Grid>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <div
                data-slot="video-poster"
                className={`relative aspect-[1144/644] w-full overflow-hidden rounded-xs ${scrollScale} ${styles.poster}`}
              >
                <Image
                  src="/assets/images/video-explainer/poster.png"
                  alt="Collage of archival loss control photographs with the words “Loss Control, rebuilt for today.”"
                  fill
                  // HTML sizes cannot read CSS variables; mirror --space-page-inline.
                  sizes="(min-width: 1440px) 1144px, (min-width: 1024px) calc((100vw - clamp(2rem, calc(2rem + 2 * ((100vw - 24.375rem) / 65.625)), 4rem) + 16px) * 10 / 12 - 16px), calc(100vw - clamp(2rem, calc(2rem + 2 * ((100vw - 24.375rem) / 65.625)), 4rem))"
                  className="object-cover"
                />

                <span
                  aria-hidden="true"
                  data-slot="video-play"
                  className="absolute top-1/2 left-1/2 flex size-16 -translate-1/2 items-center justify-center overflow-hidden rounded-full bg-black/60 ring-[0.5px] ring-white/15 ring-inset backdrop-blur-xs md:size-[110px]"
                >
                  <span className="relative size-8 translate-x-0.5 md:size-14">
                    <Image src="/assets/icons/video-explainer/play.svg" alt="" fill />
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_0.8px_var(--color-black)] shadow-black/10"
                />
              </div>
            </div>
          </Grid>
        </Container>
      </div>
    </section>
  );
}
