import Image from "next/image";
import { Container, Grid } from "@/components/layout/grid";
import { ChallengeArtwork } from "./challenge-artwork";
import { challengeStates, type ChallengeState } from "./challenge-data";
import styles from "./challenge-today.module.css";

function ChallengeBackdrop() {
  return (
    <div data-slot="challenge-visual" className={`pointer-events-none absolute inset-0 ${styles.visual}`} aria-hidden="true">
      <Image
        src="/assets/images/features/card-texture.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <ChallengeArtwork />
    </div>
  );
}

function ChallengeStateContent({ state }: { state: ChallengeState }) {
  const Tag = state.id === "state-1" ? "h2" : "p";
  return (
    <div
      data-slot="challenge-state"
      data-state={state.id}
      className={`col-span-12 col-start-1 text-center xl:col-start-3 xl:col-end-11 ${styles.state}`}
    >
      <Tag
        id={state.id === "state-1" ? "challenge-today-heading" : undefined}
        className="text-display-statement text-balance text-white"
      >
        {state.firstLine}
        {/* Let mobile balance the complete statement into three lines.
            Preserve the approved sentence break from tablet upward. */}
        <br className="hidden md:block" />
        {" "}
        {/* Keep the subject together rather than stranding “Your” on the
            previous line. Inline-block still allows wrapping under text zoom. */}
        <span className="inline-block">{state.secondLineLead.trim()}</span>
        {" "}
        <span className="relative inline-block text-brand-50">
          {state.emphasis}
          <span
            data-slot="challenge-underline"
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 w-full ${styles.underline}`}
            style={{ top: `calc(100% + ${state.underline.offset}px)`, aspectRatio: `${state.underline.width} / ${state.underline.height}` }}
          >
            <Image src={state.underline.src} alt="" fill />
          </span>
        </span>
        {state.suffix}
      </Tag>
    </div>
  );
}

// Figma: 566:5762 → 409:3596 → 409:3612, each 1440 × 928.
// Native scroll timelines drive the persistent artwork and all three statements.
// No mobile state frames exist: cover-fit artwork is an inferred adaptation.
// User-requested tighter mobile edges: reuse the 12px related-gap spacing role.
// The shared Container/Grid still consume the inherited grid token.
export function ChallengeToday() {
  return (
    <section
      aria-labelledby="challenge-today-heading"
      data-slot="challenge-today"
      className={`relative isolate bg-black max-md:[--grid-margin:var(--space-related-gap)] ${styles.track}`}
    >
      <div data-slot="challenge-stage" className={styles.stage}>
        <ChallengeBackdrop />
        <Container>
          <Grid className={`items-center ${styles.contentGrid}`}>
            {challengeStates.map((state) => <ChallengeStateContent key={state.id} state={state} />)}
          </Grid>
        </Container>
      </div>
    </section>
  );
}
