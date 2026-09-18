import Image from "next/image";
import { Container, Grid } from "@/components/layout/grid";

type ChallengeState = {
  id: "state-1";
  firstLine: string;
  secondLineLead: string;
  emphasis: string;
};

const stateOne: ChallengeState = {
  id: "state-1",
  firstLine: "90% of your time is spent at the desk.",
  secondLineLead: "Your expertise ",
  emphasis: "belongs in the field.",
};

function ChallengeBackdrop() {
  return (
    <div data-slot="challenge-visual" className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Image
        src="/assets/images/features/card-texture.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
    </div>
  );
}

function ChallengeStateContent({ state }: { state: ChallengeState }) {
  return (
    <div
      data-slot="challenge-state"
      data-state={state.id}
      className="col-span-12 text-center xl:col-start-3 xl:col-end-11"
    >
      <h2
        id="challenge-today-heading"
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
          <Image
            src="/assets/icons/challenge-today/state-1-underline.svg"
            alt=""
            aria-hidden="true"
            width={391}
            height={11}
            className="pointer-events-none absolute top-[calc(100%+4px)] left-0 h-auto w-full max-w-none"
          />
        </span>
      </h2>
    </div>
  );
}

// Figma: "The Challenge Today - State 1" (409:3580), 1440 × 928.
// The backdrop is intentionally separate from the state content so future
// scroll-driven states can replace the copy without rebuilding the visual stage.
// User-requested tighter mobile edges: reuse the 12px related-gap spacing role.
// The shared Container/Grid still consume the inherited grid token.
export function ChallengeToday() {
  return (
    <section
      aria-labelledby="challenge-today-heading"
      data-slot="challenge-today"
      className="relative isolate h-screen overflow-hidden bg-black max-md:[--grid-margin:var(--space-related-gap)]"
    >
      <ChallengeBackdrop />
      <Container className="h-full">
        <Grid className="h-full items-center">
          <ChallengeStateContent state={stateOne} />
        </Grid>
      </Container>
    </section>
  );
}
