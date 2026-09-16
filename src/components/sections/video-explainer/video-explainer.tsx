import Image from "next/image";
import { Container, Grid } from "@/components/layout/grid";

// Figma: Video Explainer (392:6904). A 1144×644 video poster on columns 2–11.
// Figma shows the poster and play control only — no video source or playback
// behavior is defined, so the play control is visual.
//
// Scroll interaction: where CSS scroll-driven animations are supported (and
// motion is allowed), the section becomes a tall scroll track with a sticky,
// viewport-height stage. The poster scales from 75% to its full Figma size as
// the section scrolls in, then holds while pinned. Otherwise it renders as the
// static Figma layout.
const scrollTrack =
  "[view-timeline-name:--video-explainer] motion-safe:supports-[animation-timeline:view()]:h-[160svh] motion-safe:supports-[animation-timeline:view()]:md:h-[200svh] motion-safe:supports-[animation-timeline:view()]:py-0";

const scrollStage =
  "motion-safe:supports-[animation-timeline:view()]:sticky motion-safe:supports-[animation-timeline:view()]:top-0 motion-safe:supports-[animation-timeline:view()]:flex motion-safe:supports-[animation-timeline:view()]:h-svh motion-safe:supports-[animation-timeline:view()]:items-center motion-safe:supports-[animation-timeline:view()]:pt-21";

// Grows from when the section enters the viewport until 60% through the pinned phase.
const scrollScale =
  "motion-safe:supports-[animation-timeline:view()]:animate-scroll-scale-in motion-safe:supports-[animation-timeline:view()]:[animation-timeline:--video-explainer] motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_contain_60%]";

export function VideoExplainer() {
  return (
    <section aria-label="Nettle explainer video" className={`relative bg-white py-30 ${scrollTrack}`}>
      <div data-slot="video-stage" className={`w-full ${scrollStage}`}>
        <Container>
          <Grid>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <div
                data-slot="video-poster"
                className={`relative aspect-[1144/644] w-full overflow-hidden rounded-xs will-change-[scale] ${scrollScale}`}
              >
                <Image
                  src="/assets/images/video-explainer/poster.png"
                  alt="Collage of archival loss control photographs with the words “Loss Control, rebuilt for today.”"
                  fill
                  sizes="(min-width: 1440px) 1144px, (min-width: 1024px) calc((100vw - 64px) * 1144 / 1376), calc(100vw - 64px)"
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
