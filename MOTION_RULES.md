# Nettle Motion Rules

Shared source of truth for everyone animating the Nettle website: the Motion Designers (Rycho, Agil) and whichever implementation agent each of them uses (Claude, Codex, or another). The same rules, gates, principles and constraints apply regardless of agent.

- Status: v1, written 2026-09-18 after the Step 4A audit and the Step 4A.1 reference audit were approved.
- Branch: `feat/motion-system`. No designer branches. Never push without a Motion Designer instruction.
- Companion files: `src/motion-lab/sections/<section>/<concept>/storyline.md` (per Concept), `src/motion/` (motion core), `src/motion-lab/` (lab, dev only), `scripts/motion.test.mjs` and `scripts/motion-build.test.mjs` (guards).

## How to read this document

Every rule has a category and an id so it can be cited in a storyline, a review or a commit message (for example "per H2" or "see T4").

| Prefix | Category | Meaning |
|---|---|---|
| `H` | Hard Rule | Must not be violated. Only the approval named in the rule can lift it. |
| `P` | Motion Principle | Strong default. A Concept may depart from it when its approved storyline says why. |
| `W` | Workflow Rule | How Motion Designers and implementation agents collaborate. |
| `T` | Technical Constraint | Derived from the repository and its tests. Cites what enforces it. |

Recorded decisions (section 8) and open decisions (section 16) are not rules; they are the project's memory.

### Authority order

When sources conflict, the higher item wins:

1. Explicit Motion Designer decision
2. Approved Storyline
3. Existing coded Nettle implementation / approved visual baseline
4. Nettle repository constraints and tests
5. These Motion Rules
6. Motion Designer-selected references
7. Emil Kowalski / Animations.dev principles
8. Beam learnings

Never silently resolve a meaningful conflict. If an unresolved conflict affects the current task, stop and ask the Motion Designer. An unresolved item blocks only the decision it affects; everything else continues.

---

## 1. Objective

The task is to animate the existing Nettle website implementation, which Rifqi translated from the approved Figma design into code. This is **motion design, not redesign**. The coded implementation is the visual baseline and the resolved rest state of every animation.

Motion may enhance storytelling, hierarchy, continuity, interaction, responsiveness and perceived quality. It must not unnecessarily change layout, component structure, typography, spacing, assets, visual hierarchy or visual identity.

### Hard Rules

- **H1 · No redesign for motion.** Do not change layout, components, typography, spacing, assets or hierarchy to make an animation easier. If an approved motion direction genuinely needs a visual or structural change, stop and request Motion Designer approval before touching production. Record the approval in the storyline.
- **H2 · Gate 1 before code.** No Concept implementation exists before its storyline is explicitly approved. The guard test refuses Concept code without the approval line (see T13).
- **H3 · Gate 2 before production.** Nothing is integrated into production before the Motion Designer approves the motion. The implementation agent never marks its own work approved and never writes an approval line on a designer's behalf.
- **H4 · The agent never invents the direction.** Storyline directions are proposed as options with trade-offs and chosen by a Motion Designer. Ownership, approvals and creative decisions are never assumed.
- **H5 · Reduced motion is defined and implemented.** Every storyline defines reduced-motion behaviour; every implementation honours the operating-system preference and the lab's forced reduced-motion mode.
- **H6 · Production behaviour is preserved.** Scroll, carousel snap, instant arrow scrolling, keyboard navigation, focus, semantics, image loading and the Original's render at rest stay as they are (see T8). Changing any of them needs Motion Designer approval per behaviour.
- **H7 · No unapproved client boundaries.** No new `"use client"` file under `src/components` and no expansion of the client-file allowlist without Motion Designer approval; the guard is updated in the same change as the approval (see T1).
- **H8 · No unapproved dependencies.** No animation, tuning or DialKit package is added, and no DialKit version chosen, without an explicit Motion Designer decision (see section 12).
- **H9 · Header and logo stay still.** The site header and the functional logo are not animated unless an approved variant in the design docs allows it (see T2).
- **H10 · Tests are never weakened.** Existing tests are not weakened, deleted, bypassed or rewritten to admit motion. New motion guards may be added.
- **H11 · The lab stays out of production.** The Motion Lab and all tuning tooling remain development-only, with no public flag (see T10).
- **H12 · One branch, no unprompted pushes.** Work happens on `feat/motion-system`. Commits are checkpoints requested by a Motion Designer; pushes need an explicit instruction.
- **H13 · Production hooks need approval.** Slot names, wrappers, MotionScope attachment and targeting attributes in production files are not pre-approved (see section 11).
- **H14 · No new colour states, weights or dimensions without approval.** Motion does not introduce new colours, change stroke or visual weight, or use perspective/3D transforms unless the approved storyline says so (see section 8).

---

## 2. Current scope: Business Lines → 7 Concepts

The current priority is the **Business Lines** section, which holds seven key visuals (the layered line-of-business illustrations): Commercial Property, Worker's Compensation, Liability, Construction & Builder's Risk, Commercial Auto & Fleet, High Net Worth Home, and Energy, Marine & Specialty.

In the Motion Lab this is represented as **one Concept per key visual** under the Business Lines section. There is no separate Key Visual registry tier. Each Concept has its own owner, storyline, approval lifecycle, lab implementation, tuning and production integration.

- Ownership was divided on 2026-09-19 (RJ-11): **Rycho** owns Worker's Compensation, High Net Worth Home, Commercial Property and Liability; **Agil** owns Construction & Builder's Risk, Commercial Auto & Fleet, and Energy, Marine & Specialty. Ownership is recorded in the section registry and changes only by Motion Designer decision.
- The seven Concepts may use different choreography while belonging to one Nettle motion language (P7).
- Concept ids should equal the visual ids used in `src/components/sections/business-lines/data.ts` so the lab, the storyline and the artwork stay aligned.

Facts about the section that every Business Lines storyline must respect are collected in T3 to T8.

---

## 3. Shared Motion Workflow

```
Select Concept
→ Inspect Original
→ Understand Content + Communication Goal
→ Develop 2–3 Storyline Directions
→ Motion Designer Review
→ Revise
→ Gate 1: Storyline Approved
→ Implement Concept in Motion Lab
→ Tune
→ Motion Designer Review
→ Gate 2: Motion Approved
→ Promote / Integrate
→ QA
```

### Workflow Rules

- **W1 · The state chip decides the stage.** The implementation agent reads the Concept's state (section 12) before acting. A prompt such as "animate this visual" while the Concept is at **Storyline** means "develop storyline directions", never "start coding animation".
- **W2 · Options, not answers.** At the Storyline stage the agent proposes two or three directions with meaningful trade-offs, each grounded in the visual's content and communication goal. The Motion Designer picks, edits, merges or rejects.
- **W3 · Inspect before proposing.** Before any storyline direction, the agent inspects the Original in the Motion Lab at the four viewport presets and records the visual's layer inventory, existing transforms, masks, clipping and responsive behaviour in the storyline's production-hooks section.
- **W4 · Review notes land in the artefact.** Gate 1 feedback goes into `storyline.md`; Gate 2 feedback goes into tuning values (and, later, the motion spec). A Concept moves to In Review only when its owner says so.
- **W5 · Every review gets a packet.** For each review the agent reports: Concept and state, the lab URL, viewports checked, compare mode used, reduced-motion result, hover forward/reverse behaviour where applicable, test results, and what remains unresolved. No claims of approval.
- **W6 · One checkpoint per approved step.** Commits are made when a Motion Designer asks, on the shared branch, with a message that names the Concept and the gate reached.
- **W7 · Unresolved items are logged, not decided.** Anything undecided goes into section 16 with an owner. It blocks only the decision it affects.
- **W8 · Approval records are explicit.** Gate 1 lives in `storyline.md` as `Approved by: <Motion Designer> on YYYY-MM-DD`. Gate 2 lives in the future motion spec as `Approved by:` (see section 13). No snapshot hashes are required until snapshot infrastructure exists.
- **W9 · Owners approve their Concepts.** By default the Motion Designer responsible for a Concept approves its storyline and its motion. Cross-review is used when explicitly requested.
- **W10 · Agent-agnostic.** Nothing in a storyline, spec or commit depends on which implementation agent produced it. Files, headings and approval lines follow this document, not an agent's habits.

---

## 4. Storyline requirements

A storyline is the creative contract for one Concept. It lives at `src/motion-lab/sections/<section>/<concept>/storyline.md` and must define, under these headings (the first, third, sixth and last are checked by the guard):

```
# <Concept title>

Section: <section id> · Concept: <concept id> · Owner: <unassigned | Rycho | Agil>

## Intent
What the motion is for, in one or two sentences.

## Communication goal
What a viewer should understand or feel about this line of business after seeing it.

## Beats
Numbered. For each beat: what the viewer sees, what changes, in what order,
and why that sequence communicates the intended idea.

## Interaction
Trigger and playback model (for Business Lines: hover forward/reverse per section 5),
plus the explicit touch/mobile behaviour.

## Responsive
What changes when the card is one, two or three up, and at Fluid.

## Reduced motion
What plays, what is removed, what jumps. The static Original is always valid.

## Production hooks
Any slot names, wrappers, MotionScope attachment or structural change the motion
needs, with the reason and whether it alters the Original. "None" is a valid answer.

## Unresolved
Decisions still open, each with who decides.

## Approval
Approved by: <Motion Designer> on YYYY-MM-DD
```

- Beats describe meaning and sequence, not milliseconds, easing curves, transform values or implementation syntax. Those belong to lab implementation and tuning.
- A storyline may state pacing in words (quick, held, lagging) and relationships (this leads, that follows).
- Two or three directions are presented before one is chosen; the chosen direction becomes the storyline, and the alternatives may be kept in a short "Directions considered" note below the beats.

---

## 5. Business Lines interaction model

This section defines the interaction model for the current seven Concepts. It does not define any visual's choreography.

The baseline is **Original rest state ⇄ animated state**, with **hover-driven reversible playback** on desktop.

- **P1 · Hover drives forward and reverse.** Pointer enter plays the approved animation forward; pointer leave plays it in reverse from the current progress.
- **P2 · Playback is interruptible.** Pointer changes during playback continue smoothly from the current progress. Never snap unnecessarily back to the beginning; never restart harshly when the hover state changes.
- **P3 · Reverse is the same choreography.** The reverse direction is normally the spatially continuous reverse of the approved forward animation, not a separate choreography, unless the storyline explicitly defines otherwise.
- **P4 · Hover only where hover exists.** Hover interaction applies only where a hover-capable, fine-pointer device is present. Touch and mobile behaviour is defined explicitly by each storyline (open decision OD-6 until then).
- **P5 · Idle looping is not the default.** A visual rests at its Original unless a storyline argues for a loop and the Motion Designer approves it.

Driver support for reversible, progress-preserving playback is built with the first Concept; today the lab transport offers play, pause, replay and reset (section 12).

---

## 6. Shared motion language

The Motion Designer-selected references establish creative direction, not animations to copy. These principles are strong defaults; a storyline may depart from any of them with a stated reason.

- **P6 · Construct, don't default to fade.** Prefer structural movement (extrude, stack, align, turn, reveal by occlusion) when it communicates the visual more effectively. Opacity may support an animation but is not automatically the primary motion.
- **P7 · One family, many constructions.** The seven visuals may have independent choreography. Consistency comes from motion character, easing philosophy, pacing relationships, restraint, spatial continuity and interaction behaviour, not from identical animations or identical beat structures.
- **P8 · Rest is the composition.** The existing coded visual is the resolved state. Motion departs from it and resolves back into it. The Original must remain visually valid without motion, and it is what reduced motion may show.
- **P9 · Structural sequencing.** Sequence elements by the relationships inside the composition (scaffold and content, base and tiers, outside and centre), never by DOM order or layer index.
- **P10 · Lead and follow.** Related layers may move with intentional lag. Do not default to every layer starting at once. Follow-through comes from relationships and lag, not from overshoot.
- **P11 · Hold → transformation → hold.** A pacing reference where appropriate: short movement, resolved hold. It is not a mandatory formula.
- **P12 · Controlled settle.** Clear departure, decelerated arrival. Zero bounce is the default character; bounce or overshoot needs a reason in the approved storyline.
- **P13 · Contained motion.** Respect the approved frame, clipping, masks and composition. Do not introduce camera-like movement of the whole artwork (pan, zoom, drift) without a storyline reason.
- **P14 · Turns are reveals.** Rotation exists to show something. Decorative spinning is not part of the language.
- **P15 · Restraint.** One entrance per container; if everything moves, nothing reads. A visual may earn stillness.

---

## 7. Easing and timing philosophy

- **P16 · Easing by purpose.** Entering and settling motion favours deceleration. On-screen spatial transitions preserve continuity (ease-in-out character). Constant motion may be linear. Colour and opacity may use simpler easing. Interruptible interaction stays smooth when direction changes. Choose the easing character before shortening a duration; a flat animation usually has a weak curve, not a long duration.
- **P17 · Marketing pace may breathe.** Nettle is a marketing site; explanatory motion may run longer than interface micro-interactions, with holds, as long as it stays purposeful.
- **P18 · Duration follows distance and scale.** Larger travel and larger elements take longer; exits and reversals are not padded beyond their forward counterpart.
- **P19 · Values come from the workflow, not from presets.** Final timing and easing values come from Storyline intent → Motion Lab → Tuning → Motion Designer approval. Global timing presets are not frozen prematurely. The values in `src/motion/tokens.css` are starting points, not approved motion.
- **P20 · Reference numbers are ranges.** External numbers appear only as starting ranges: stagger around 30–80 ms, marketing movement around 0.5–1.5 s, holds around 1–2 s. They are not mandatory. Do not reject an approved motion because it falls outside a reference range. Stronger shared conventions may emerge from the first approved Business Lines Concepts and are recorded here only after they exist (OD-7).

---

## 8. Recorded reference judgments

Motion Designer decisions from the Step 4A.1 reference audit. They are decisions, not rules to re-litigate.

| # | Decision |
|---|---|
| RJ-1 | Pinterest reference 4 (the DBM "+" identity) is composition-only until its actual animation can be inspected. |
| RJ-2 | Marketing pacing with holds is appropriate. Reference starting ranges: movement about 0.5–1.5 s, holds about 1–2 s. References, not presets. |
| RJ-3 | Idle looping is not the default (P5). |
| RJ-4 | Whether photography or linework acts as the anchor is decided per storyline. |
| RJ-5 | In-plane transforms are the safe default. Perspective or 3D transformations require Motion Designer approval per storyline (H14). |
| RJ-6 | No new colour states without approval (H14). |
| RJ-7 | Continuous transformation between resolved states is preferred over hard cuts. |
| RJ-8 | Business Lines uses the hover forward/reverse interaction model (section 5). |
| RJ-9 | The seven visuals use independent choreography within a shared motion language (P7). |
| RJ-10 | Stroke weight and visual weight are frozen by default. Transient weight changes require approval (H14). |
| RJ-11 | 2026-09-19: Business Lines ownership split by workload. Rycho: Worker's Compensation (high), High Net Worth Home (medium), Commercial Property (low), Liability (low). Agil: Construction & Builder's Risk, Commercial Auto & Fleet, Energy, Marine & Specialty (all medium). Closes OD-1. |

### External craft guidance

The audited Emil Kowalski / Animations.dev material is craft guidance, ranked seventh in the authority order. Its useful principles: easing by purpose, spatial continuity, interruptibility, restraint, perceived performance, duration relative to distance and scale, meaningful stagger, object permanence, appropriate hover behaviour, and reduced-motion consideration. Do not inherit its conflicting or overly prescriptive rules (for example its interface duration ceiling or its blanket "no scroll animation" stance for marketing pages); Nettle decisions take precedence. Beam's workflow learnings rank eighth and inform tooling, not creative direction.

---

## 9. Implementation philosophy

### CSS-first

- **P21 · CSS-first means simplest appropriate, not CSS-only.** Prefer the simplest implementation that preserves performance, maintainability, interruptibility and the approved motion concept. JavaScript-driven motion, browser APIs (such as the Web Animations API), another driver, or an animation library may be appropriate when an approved Concept genuinely requires them.
- **W11 · Justify a new runtime dependency before asking.** Before proposing a motion dependency: explain why existing capabilities are insufficient, identify the implementation and performance trade-offs, then request Motion Designer approval (H8). Never add one speculatively.

### Scroll

- **P22 · Scroll motion earns its place.** Scroll-triggered or scroll-driven motion is allowed when it meaningfully supports an approved storyline. Do not fade-up an element merely because it entered the viewport.
- **H15 · Never hijack scrolling.** Native vertical scrolling, carousel scrolling, snapping, keyboard behaviour and expected user control are preserved.
- **P23 · Triggers are per Concept.** Each storyline defines its trigger; there is no universal trigger rule.

### Reduced motion

- **P24 · Gentler, not necessarily zero.** Where appropriate, reduce or remove large spatial travel, decorative movement, unnecessary rotation, unnecessary scale change and repeated motion. Where appropriate, retain opacity, colour, instant state changes and simplified explanatory transitions. The static Original is always a valid fallback.
- **P25 · Reduced motion is designed, not slowed.** Never assume reduced motion means the same animation slower. Every storyline defines it explicitly (H5).

### Performance

- **P26 · Compositor-safe first.** Animate transform and opacity first. Masks, filters and clip changes only after measuring. `will-change` only after dropped frames are observed. Nothing above one frame budget at the Mobile preset.

---

## 10. Technical constraints

Facts about the Nettle repository. Each names what enforces it.

- **T1 · Server Components by default.** Homepage sections are React Server Components. The only client files allowed under `src/components` are the four the motion guard lists (the three carousel wrappers and the carousel controls). Adding `"use client"` to a section, artwork or page fails `scripts/motion.test.mjs`, `scripts/performance.test.mjs` and `scripts/usage-guidelines.test.mjs`. Motion attaches through `MotionScope` (a client wrapper in `src/motion`) and CSS by default (H7).
- **T2 · The header is frozen.** `SiteHeader` carries no `"use client"`, listeners, `requestAnimationFrame`, `will-change` or `translateZ` (`scripts/performance.test.mjs`). The functional logo is not animated without an approved variant (design-system usage docs) (H9).
- **T3 · Business Lines composition.** The section, heading, cards, artwork and copy are server-rendered; `BusinessLineCarousel` and `CarouselControls` are the client seams. Cards are `overflow-hidden` with an inset outline above the artwork and a texture below it; the artwork canvas is `overflow-hidden` too. Motion beyond the artwork bounds is cropped.
- **T4 · Artwork geometry is authored, not free.** Each visual is a 448 × 385 `ScaledCanvas` of absolutely positioned layers: riso photographs clipped by SVG masks (some through an inverse-matrix wrapper) and SVG linework, with existing `rotate`, `scaleX(-1)` and `matrix` transforms. Never overwrite an existing `transform` or mask in a way that destroys the approved Figma geometry. Compose motion through a wrapper or the individual `translate`, `rotate` and `scale` properties, and never animate mask geometry without measuring.
- **T5 · ScaledCanvas scale is untouchable.** Its `scale` belongs to responsive layout, not choreography. Its inner tree is `aria-hidden`; motion inside it is decorative by construction.
- **T6 · Layers have no hooks yet.** Artwork layers are keyed by index and carry no slot names. Any hook is a production edit under section 11.
- **T7 · Two in-view roots.** The section enters by vertical page scroll; cards enter the track by horizontal scroll, snap, the arrow buttons or arrow keys, and re-enter repeatedly. On desktop the third card is intentionally cropped at the viewport edge. Any in-view logic must state which root it observes.
- **T8 · Carousel behaviour is production.** Mandatory scroll snap, instant (not smooth) arrow scrolling, arrow-key navigation, controls hidden below the `md` breakpoint, the responsive card widths (one card below 48rem, two to 80rem, three above) and the cropped third card are frozen unless explicitly approved for change (H6). Tests pin the card padding exception, the card-width variable, the shared texture path and `rounded-lg` in the section file, and forbid clamp utilities and breakpoint type swaps in the carousel file (`scripts/spacing.test.mjs`, `scripts/typography.test.mjs`, `scripts/usage-guidelines.test.mjs`).
- **T9 · The motion core is production-safe and library-free.** `src/motion` holds `MotionScope` (state attributes `data-motion-state` off/idle/enter and `data-motion-reduced`, spec values as `--m-*` CSS variables), the spec with eight control groups, the CSS driver (Web Animations API for play, pause, replay, reset), `useInView`, `useReducedMotion` and unapproved starting tokens. It never imports the lab, the stage or a library (`scripts/motion.test.mjs`). Other drivers plug into the same seam only by decision.
- **T10 · Production isolation is guarded twice.** Routes under `/motion-lab` are development-only with no public flag, production code never imports the lab, and a production build contains no lab chunks, strings or CSS (`scripts/motion.test.mjs`, `scripts/motion-build.test.mjs`) (H11).
- **T11 · No motion libraries.** Nothing motion- or tuning-related is in `package.json` or imported in `src` (`scripts/motion.test.mjs`) (H8).
- **T12 · Layout properties are never animated.** CSS under `src/motion` may not animate width, height, margin, padding, inset or type metrics (`scripts/motion.test.mjs`).
- **T13 · Gate 1 is mechanical.** A registered Concept may exist at Storyline with no folder. Once its folder exists it must carry `storyline.md` with `## Intent`, `## Beats`, `## Reduced motion` and `## Approval`, and that file must carry the `Approved by: <name> on YYYY-MM-DD` line before any `.ts`, `.tsx` or `.css` file exists in the folder or the state leaves Storyline. A Concept's `visual` must name a key in the section's data (`scripts/motion.test.mjs`) (H2).
- **T14 · Existing conventions.** The only shipped motion is the Video Explainer's CSS scroll timeline, gated by `motion-safe` and `@supports (animation-timeline: view())` with a static full-size fallback (`scripts/spacing.test.mjs`). Tokens are Tailwind v4 CSS-first in `src/app/globals.css`; motion adds no colour or spacing tokens. Page files keep their server composition (`scripts/performance.test.mjs`).
- **T15 · Toolchain.** Package manager is pnpm. Before any report: `pnpm lint`, `pnpm typecheck`, `pnpm test` (all suites). Do not weaken any of them (H10).

---

## 11. Production hooks

Non-visual production hooks are **not** blanket pre-approved (H13). This includes slot names on artwork layers, wrapper elements, attaching `MotionScope` to a production component, and any additional targeting attribute.

When an approved storyline requires a hook:

1. Identify the exact change (file, element, attribute or wrapper).
2. Explain why the motion needs it.
3. Confirm it does not alter the Original at rest (render, layout, semantics, tests).
4. Request Motion Designer approval and record it in the storyline's production-hooks section.
5. Modify production only after approval, in a change that touches nothing else.

Do not prepare speculative hooks for all seven visuals.

---

## 12. The Motion Lab today

Development-only workspace at `/motion-lab` under `next dev`. Everything below exists now; planned features are in section 13.

- **Sections and Concepts.** The left navigation lists the homepage sections in page order. Each opens on its **Original**, the production component exactly as the site renders it. Concepts appear under a section once registered; each shows its owner and state chip. A filter narrows sections, Concepts and states.
- **Storyline.** Below the preview. The Original has none. A Concept's storyline is shown from its `storyline.md` once Concepts exist.
- **Viewport presets.** Desktop 1440 × 900, Tablet 768 × 1024, Mobile 390 × 844, and Fluid. Previews render in real iframes at true widths, so media and container queries behave as on the site.
- **Compare.** Motion, Original, or Side by side. For an Original entry, Motion and Original show the same production part. For a Concept that names a production visual (every Business Lines Concept), **Motion** shows that key visual alone as the focused workspace, at its real production size for the chosen viewport; **Original** shows the whole production section unchanged; **Side by side** pairs the isolated visual with the full section, focused work beside real context.
- **Playback.** Play, Pause, Replay, Reset, with a readout of play state, time and duration. Scroll-driven animations report no time and are scrubbed by scrolling.
- **Reduced motion.** A toggle forces the reduced-motion mode inside the preview; the readout also shows the operating-system setting.
- **Grid.** Overlays the 12-column layout grid inside the preview.
- **Keyboard shortcuts.** `Space` Play/Pause, `R` Replay, `Esc` Reset, `1`–`4` viewports, `C` cycle Compare, `G` grid, `?` shortcut reference. Single keys only, never with Cmd, Ctrl or Alt, and never while typing in a field.
- **Motion Controls.** The right pane lists the eight control groups a Concept's spec declares: Timing, Easing, Stagger, Opacity, Position, Scale, Rotation, Scroll behaviour. The Original declares none.
- **Advanced.** A drawer with the component name, file path and the raw preview URL ("Open preview in a new tab").
- **Concept state** (how far a Concept has travelled): `Storyline → Draft → In Review → Approved → Live`.
- **Values state** (whether what the designer sees is recorded anywhere): `Unsaved Changes → Saved → Same as Live`.

The two states are designer-facing words. Persistence mechanics (browser storage, snapshot files, production defaults) stay behind them and never appear in the UI.

---

## 13. Planned infrastructure (not built)

Everything in this section is planned. Do not describe it as available, and do not build it without an instruction.

- **Tuning controls.** DialKit is planned but not integrated; its version is undecided (OD-2). Tuning is expected to cover Timing, Easing, Stagger, Opacity, Position, Scale, Rotation and Scroll behaviour, mapped from the spec's control groups.
- **Undo / Redo for tuning.** `Cmd/Ctrl + Z` undo, `Cmd/Ctrl + Shift + Z` redo. Reserved in the shortcut reference, not bound.
- **Reversible playback.** Driver support for hover forward/reverse from current progress (section 5), built with the first Concept.
- **Tuning persistence.** A single-owner store per Concept behind the Values state (OD-3).
- **Snapshots and promotion.** A snapshot is a review artefact; promotion bakes approved values into a motion spec under `src/motion/sections` that carries `Approved by:` (Gate 2 record) and is the only thing a production section imports (OD-4). No snapshot hashes are required until this exists.
- **Storyline rendering** in the lab's Storyline panel from the Concept's file.

---

## 14. Definition of Done

A Concept is production-ready only when all of the following hold:

- Storyline received Gate 1 approval (`Approved by:` line present).
- Implementation matches the approved intent and beats.
- The Original remains unchanged at rest (Compare: Original and Side by side).
- Hover forward/reverse works smoothly where applicable; playback reverses from current progress without harsh restart.
- Responsive behaviour is verified at Desktop, Tablet, Mobile and Fluid.
- Touch and mobile behaviour follows the storyline.
- Reduced-motion behaviour is verified with the lab toggle and the OS setting.
- No unintended layout or design changes occurred; existing production behaviour (T8) is intact.
- `pnpm lint` passes. `pnpm typecheck` passes. All test suites pass (`pnpm test`).
- Production isolation is intact (`scripts/motion-build.test.mjs` against a production build).
- The Motion Designer gives Gate 2 approval, recorded per W8.

---

## 15. Sources

- Nettle repository: `src/components/sections/business-lines/`, `src/components/visuals/product-dashboard/scaled-canvas.tsx`, `src/app/globals.css` (motion block), `scripts/*.test.mjs`, design-system usage docs.
- Nettle Motion Lab: `src/motion/`, `src/motion-lab/`, `src/app/motion-lab/`.
- Beam Website motion workflow and `ANIMATION_RULES.md` (learnings only).
- Emil Kowalski / Animations.dev skill material (craft guidance only).
- Motion Designer-selected references (Step 4A.1): Diamond Animation (echoes of abstract), Isometric Cube (Kirill Epler), BBAU Engineered Logo (hymn.design), 2d Pillar / DBM identity (Péricles Motion; composition-only, RJ-1).

---

## 16. Open decisions

Unresolved items are never decided silently by an implementation agent. Each blocks only the decision it affects.

| Id | Decision | Owner | Blocks |
|---|---|---|---|
| OD-1 | Closed 2026-09-19, see RJ-11 | — | — |
| OD-2 | DialKit version (1.4.3 with its `motion` peer dependency, or 2.x) | Motion Designer | Tuning controls |
| OD-3 | Tuning persistence architecture behind the Values state | Motion Designer with implementation input | Saved / Same as Live |
| OD-4 | Snapshot and promotion implementation | Motion Designer with implementation input | Gate 2 record format beyond `Approved by:`, Live state |
| OD-5 | Whether an animation library is ever required, and which | Motion Designer, per Concept need (W11) | Any non-CSS driver |
| OD-6 | Touch / mobile interaction per Concept | Concept owner, in each storyline | Mobile behaviour of that Concept |
| OD-7 | Stronger shared timing and easing conventions after approved Concepts exist | Motion Designers | Any global preset |

Closed decisions are moved to section 8 with their date.
