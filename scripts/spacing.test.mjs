import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { spacingTokens, responsiveSpacing, sectionSpacing, spacingExceptions } from "../src/app/design-system/_data/spacing.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const css = read("src/app/globals.css");
const widths = [320, 390, 768, 1024, 1280, 1440, 1920];
const close = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-8, `${label}: ${actual} vs ${expected}`);
const property = (name) => {
  const found = css.match(new RegExp(`${name}:\\s*([^;]+);`));
  assert.ok(found, name);
  return found[1];
};
const rangeMin = Number.parseFloat(property("--type-viewport-min"));
const rangeSpan = Number(property("--type-viewport-span"));

// Independent approved Balanced plan endpoints (default-root pixels).
const approved = {
  "micro-gap": [
    4,
    4
  ],
  "tight-gap": [
    8,
    8
  ],
  "related-gap": [
    12,
    12
  ],
  "heading-gap": [
    12,
    16
  ],
  "component-gap": [
    16,
    24
  ],
  "content-gap": [
    24,
    32
  ],
  "content-block-gap": [
    24,
    48
  ],
  "major-content-gap": [
    32,
    64
  ],
  "visual-gap": [
    40,
    80
  ],
  "page-inline": [
    16,
    32
  ],
  "card-padding": [
    20,
    24
  ],
  "card-padding-spacious": [
    24,
    32
  ],
  "card-leading": [
    46,
    56
  ],
  "section-content-gap": [
    24,
    46
  ],
  "section-standard": [
    48,
    120
  ],
  "section-generous": [
    64,
    160
  ],
  "section-prominent": [
    64,
    180
  ],
  "section-major": [
    64,
    200
  ],
  "section-adjoining": [
    32,
    90
  ],
  "section-media": [
    32,
    120
  ],
  "section-opening-start": [
    48,
    98
  ],
  "section-opening-end": [
    32,
    60
  ],
  "section-flush": [
    16,
    32
  ]
};

function rule(name, trail = []) {
  assert.ok(!trail.includes(name), "No circular spacing aliases");
  const value = property(name);
  const alias = value.match(/^var\((--space-[\w-]+)\)$/);
  if (alias) return rule(alias[1], [...trail, name]);
  const fixed = value.match(/^([\d.]+)rem$/);
  if (fixed) return { min: Number(fixed[1]) * 16, max: Number(fixed[1]) * 16, at: (_width, rootSize = 16) => Number(fixed[1]) * rootSize };
  const match = value.match(/^clamp\(([\d.]+)rem, calc\(([\d.]+)rem \+ ([\d.]+) \* var\(--space-fluid-step\)\), ([\d.]+)rem\)$/);
  assert.ok(match, `${name} must use shared bounded interpolation`);
  const [, min, base, delta, max] = match.map(Number);
  close(min, base, "Base"); close(delta, max - min, "Delta");
  return {
    min: min * 16, max: max * 16,
    at: (width, rootSize = 16) => Math.min(max * rootSize, Math.max(min * rootSize, base * rootSize + delta * (width - rangeMin * rootSize) / rangeSpan)),
  };
}

test("Spacing shares the unchanged typography range and base unit", () => {
  assert.equal(property("--space-fluid-step"), "var(--type-fluid-step)");
  assert.equal(property("--type-fluid-step"), "calc((100vw - var(--type-viewport-min)) / var(--type-viewport-span))");
  assert.deepEqual([responsiveSpacing.minViewport, responsiveSpacing.maxViewport, responsiveSpacing.defaultRootSize], [390, 1440, 16]);
  close(rangeMin * 16, 390, "Min viewport");
  close((rangeMin + rangeSpan) * 16, 1440, "Max viewport");
  assert.doesNotMatch(css, /--spacing\s*:/);
  const names = [...css.matchAll(/(--space-[\w-]+):/g)].map((m) => m[1]).filter((n) => n !== "--space-fluid-step").sort();
  assert.deepEqual(names, spacingTokens.map((t) => t.name).sort());
  assert.equal(names.length, Object.keys(approved).length);
});

for (const token of spacingTokens) {
  test(`${token.name}: metadata, approved endpoints, bounds and monotonicity`, () => {
    assert.deepEqual([token.min, token.max], approved[token.name.replace("--space-", "")]);
    assert.equal(token.scaling, token.min === token.max ? "fixed" : "fluid");
    if (token.aliasOf) assert.equal(property(token.name), `var(${token.aliasOf})`);
    const size = rule(token.name);
    close(size.min, token.min, "CSS min"); close(size.max, token.max, "CSS max");
    for (const rootSize of [16, 20, 32]) {
      let previous = -Infinity;
      for (const width of [...new Set([...widths, ...Array.from({ length: 161 }, (_, i) => 320 + i * 10)])].sort((a, b) => a - b)) {
        const actual = size.at(width, rootSize);
        const progress = Math.max(0, Math.min(1, (width / rootSize - 390 / 16) / (1050 / 16)));
        close(actual, (token.min + (token.max - token.min) * progress) * rootSize / 16, "Interpolation");
        assert.ok(actual >= previous && actual >= size.min * rootSize / 16 && actual <= size.max * rootSize / 16);
        previous = actual;
      }
      close(size.at(390 * rootSize / 16, rootSize), token.min * rootSize / 16, "Exact min endpoint");
      close(size.at(1440 * rootSize / 16, rootSize), token.max * rootSize / 16, "Exact max endpoint");
    }
  });
}

test("Grid geometry and shared page edges remain authoritative", () => {
  assert.equal(property("--grid-columns"), "12");
  assert.equal(property("--grid-gutter"), "16px");
  assert.equal(property("--grid-max-width"), "1376px");
  assert.equal(property("--grid-baseline"), "8px");
  assert.equal(property("--grid-margin"), "var(--space-page-inline)");
  assert.equal([...css.matchAll(/--grid-margin:/g)].length, 1);
  assert.match(read("src/components/layout/grid/container.tsx"), /px-\[var\(--grid-margin\)\]/);
  assert.match(read("src/components/layout/grid/carousel.module.css"), /--grid-margin/);
  assert.match(read("src/components/layout/grid/page-grid-overlay.tsx"), /<Container/);
  assert.doesNotMatch(read("src/components/sections/challenge-today/challenge-today.tsx"), /--space-section/);
});

test("Section bindings preserve top/bottom asymmetry without extra margins", () => {
  for (const section of sectionSpacing) {
    const source = read(section.file);
    const tag = source.match(/<(?:section|footer)\b[\s\S]*?>/)[0];
    assert.ok(tag.includes(`pt-(${section.top})`) || tag.includes(`py-(${section.top})`), section.label);
    if (section.bottom) assert.ok(tag.includes(`pb-(${section.bottom})`) || tag.includes(`py-(${section.bottom})`), section.label);
    assert.doesNotMatch(tag, /\bm[tyb]-/, section.label);
    // User-requested mobile full-height Hero has symmetric padding; desktop
    // restores the approved top padding. Other sections have no such override.
    if (section.label === "Hero") {
      assert.match(tag, /py-\(--space-section-opening-end\)/);
      assert.match(tag, /md:pt-\(--space-section-opening-start\)/);
    } else {
      assert.doesNotMatch(tag, /\b(?:sm|md|lg|xl):p/, section.label);
    }
  }
  const pairs = [
    ["section-adjoining", "section-adjoining", 64, 180],
    ["section-media", "section-media", 64, 240],
    ["section-flush", "section-standard", 64, 152],
  ];
  for (const [a, b, min, max] of pairs) {
    const left = rule("--space-" + a), right = rule("--space-" + b);
    close(left.at(390) + right.at(390), min, "Combined mobile gap");
    close(left.at(1440) + right.at(1440), max, "Combined desktop gap");
  }
});

test("Shared card/content gaps replace old breakpoint spacing", () => {
  for (const file of ["features/features-carousel", "business-lines/business-line-carousel", "testimonial/testimonial-carousel"]) {
    const source = read("src/components/sections/" + file + ".tsx");
    assert.match(source, /mt-\(--space-section-content-gap\)/);
    assert.doesNotMatch(source, /md:gap-6|md:mt-\[46px\]/);
  }
  for (const file of ["features/features", "business-lines/business-lines", "security/security-card"]) {
    assert.match(read("src/components/sections/" + file + ".tsx"), /p[xytb]?-\(--space-card-padding\)/);
  }
  for (const file of ["solutions-by-role/role-card", "testimonial/testimonial"]) {
    assert.match(read("src/components/sections/" + file + ".tsx"), /p[xytb]?-\(--space-card-padding-spacious\)/);
  }
  const files = readdirSync(resolve(root, "src/components/sections"), { recursive: true });
  for (const file of files.filter((p) => p.endsWith(".tsx") || p.endsWith(".css"))) {
    // Illustration-coordinate spacing is explicitly outside this responsive scale.
    if (file.split(/[\\/]/).includes("visuals") || /artwork|metric-bar/.test(file)) continue;
    const source = read("src/components/sections/" + file);
    assert.doesNotMatch(source, /(?:gap|p[xytrbl]?|m[xytrbl]?)-\[clamp\(/, file);
  }
});

test("Footer mobile pairs navigation groups without changing desktop columns or link spacing", () => {
  const source = read("src/components/sections/footer/footer.tsx");
  assert.match(source, /grid-cols-2 gap-x-\[var\(--grid-gutter\)\] gap-y-\(--space-content-block-gap\) max-sm:gap-y-\(--space-major-content-gap\) sm:grid-cols-3 lg:col-start-7 lg:col-end-13/);
  assert.match(source, /data-slot=\{`footer-\$\{group.id\}`\} className="min-w-0"/);
  assert.match(source, /flex flex-col gap-6 text-body-medium-regular/);
  assert.match(source, /before:-inset-y-2/);
});

test("Security mobile promotes its inline link to the shared light button", () => {
  const source = read("src/components/sections/security/security.tsx");
  assert.match(source, /<Grid className="gap-y-\(--space-section-content-gap\) max-md:gap-y-\(--space-visual-gap\)">\s*<GridBand className="gap-y-\(--space-heading-gap\)">/);
  assert.match(source, /<\/GridBand>\s*<ul[^>]*data-slot="security-cards"/);
  assert.match(source, /items-start gap-\(--space-content-gap\)/);
  assert.match(source, /<Button href="#" variant="light" className="md:hidden">\s*Security overview\s*<\/Button>/);
  assert.match(source, /<Link href="#" className="relative hidden[^"\n]*md:inline">\s*Security overview →\s*<\/Link>/);
  assert.match(source, /gap-y-\(--space-section-content-gap\)/);
  assert.doesNotMatch(source, /use client/);
});

test("CTA mobile preserves its centered composition, native artwork and shared button", () => {
  const source = read("src/components/sections/cta/cta.tsx");
  const cardCss = read("src/components/sections/cta/cta.module.css");
  const artwork = read("src/components/sections/cta/cta-mobile-artwork.tsx");
  assert.match(source, /min-h-\[527px\]/);
  assert.match(source, /<CtaArtwork \/>/);
  assert.match(source, /<CtaMobileArtwork \/>/);
  assert.match(source, /<Button href="#" variant="light">See What’s Possible Today<\/Button>/);
  assert.match(source, /self-center/);
  assert.match(cardCss, /grid-column: 1 \/ -1/);
  assert.match(cardCss, /width: min\(312px, calc\(100% - 2 \* var\(--space-card-padding\)\)\)/);
  assert.match(cardCss, /gap: 32px/);
  assert.match(cardCss, /width: 1376px;\s*height: 527px/);
  assert.match(artwork, /md:hidden/);
  assert.match(artwork, /bottom-0 left-0/);
  assert.match(artwork, /absolute right-0/);
  assert.doesNotMatch(artwork, /use client|ScaledCanvas|<svg|<path/);
  for (const asset of ["vertical", "diagonal", "shallow"]) {
    assert.match(read(`public/assets/icons/cta/mobile-line-${asset}.svg`), /stroke-opacity="0.35"/);
  }
  // Approved frame: 64px heading + 32px gap + 35px button, centered in 527px.
  assert.equal((527 - (64 + 32 + 35)) / 2, 198);
});

test("Optical exceptions, link spacing and desktop layout-height reservations are preserved", () => {
  const expectations = {
    "business-lines/business-lines": ["pb-[23.2px]"],
    "security/security": ["gap-[17px]", "pb-0.5"],
    "security/security-card": ["gap-2.5", "min-h-[460px]"],
    "features/features": ["gap-2.5", "min-h-[154px]", "min-h-[156px]", "w-[calc(100%-32px)]"],
    "solutions-by-role/role-card": ["grid-rows-[minmax(108px,auto)_auto_minmax(81px,auto)]", "pb-7"],
    "testimonial/testimonial": ["min-h-[516px]", "aspect-[1144/516]"],
    "cta/cta": ["min-h-[527px]"],
    "challenge-today/challenge-today": ["h-screen"],
    "footer/footer": ["flex flex-col gap-6", "flex flex-wrap gap-4", "before:-inset-y-2"],
  };
  for (const [file, values] of Object.entries(expectations)) for (const value of values) assert.ok(read("src/components/sections/" + file + ".tsx").includes(value), file + ": " + value);
  assert.match(read("src/components/layout/site-header.tsx"), /md:px-2\.5/);
  assert.match(spacingExceptions.join(" "), /illustration-coordinate/);
  const hero = read("src/components/sections/hero/hero.tsx");
  assert.match(hero, /flex min-h-\[calc\(100vh-6rem\)\] items-center/);
  assert.match(hero, /md:block md:min-h-0/);
  assert.doesNotMatch(hero, /(?:[\s"])(?:h-screen|min-h-svh)(?:[\s"])/);
  assert.match(hero, /<ProductDashboard \/>/);
});

test("Testimonial mobile cards use the approved composition without changing desktop artwork", () => {
  const source = read("src/components/sections/testimonial/testimonial.tsx");
  const cardCss = read("src/components/sections/testimonial/testimonial.module.css");
  assert.match(source, /mobileArtwork: ReactNode/);
  assert.match(source, /mobileArtwork=\{<AllianzMobileArtwork \/>\}/);
  assert.match(source, /mobileArtwork=\{<BrotherhoodMobileArtwork \/>\}/);
  assert.match(source, /hidden select-none md:block lg:top-0/);
  assert.match(source, /select-none md:hidden/);
  assert.match(source, /<Link[^>]+className="[^"]*hidden[^"\n]*md:block/);
  assert.match(cardCss, /@media \(width < 48rem\)/);
  assert.match(cardCss, /max-width: 340px/);
  assert.match(cardCss, /min-height: 406px/);
  assert.match(cardCss, /padding: 20px/);
  assert.match(cardCss, /aspect-ratio: auto;\s*height: 180px/);
  assert.match(cardCss, /overflow-wrap: break-word/);
  assert.doesNotMatch(source, /line-clamp|truncate/);

  for (const company of ["allianz", "brotherhood"]) {
    const mobile = read(`src/components/sections/testimonial/visuals/${company}-mobile-artwork.tsx`);
    const desktop = read(`src/components/sections/testimonial/visuals/${company}-artwork.tsx`);
    assert.match(mobile, /<ScaledCanvas width=\{340\}/);
    assert.ok(mobile.includes(`${company}-mobile-linework.svg`));
    assert.match(desktop, /<ScaledCanvas width=\{1144\} height=\{516\}/);
    assert.doesNotMatch(mobile, /use client|<svg|<path/);
    assert.match(read(`public/assets/icons/testimonial/${company}-mobile-linework.svg`), /<svg/);
  }

  // A narrower viewport keeps the established next-card hint; wider mobile
  // viewports cap the composition at its native 340px design width.
  for (const width of [320, 390, 402, 430, 767]) {
    const margin = 16 + 16 * Math.min(1, Math.max(0, (width - 390) / 1050));
    const card = Math.min(340, width - margin - 16 - 32);
    const peek = width - margin - card - 16;
    assert.ok(peek >= 32 - 1e-8);
    assert.ok(card <= 340);
  }
});

test("Carousels expose a shared next-card peek and preserve native scrolling", () => {
  const shared = read("src/components/layout/grid/carousel.module.css");
  assert.match(shared, /--carousel-card-peek: calc\(2 \* var\(--grid-gutter\)\)/);
  assert.match(shared, /--carousel-single-card-width: calc\(100vw - var\(--grid-margin\) - var\(--grid-gutter\) - var\(--carousel-card-peek\)\)/);
  assert.match(shared, /overflow-x: auto/);
  assert.match(shared, /scroll-snap-type: x mandatory/);
  assert.match(shared, /\.track > li\s*\{\s*scroll-snap-align: start/);
  assert.match(shared, /scroll-padding-inline: var\(--carousel-inset\)/);
  assert.match(shared, /padding-inline: var\(--carousel-inset\)/);
  assert.match(read("src/components/sections/features/features.tsx"), /w-\[min\(448px,var\(--carousel-single-card-width\)\)\]/);
  assert.match(read("src/components/sections/business-lines/business-lines.module.css"), /--business-card-width: var\(--carousel-single-card-width\)/);
  assert.match(read("src/components/sections/testimonial/testimonial.module.css"), /--testimonial-card-width: var\(--carousel-single-card-width\)/);
  for (const width of [320, 360, 390, 402, 430]) {
    const edge = rule("--space-page-inline").at(width);
    const gutter = 16, peek = 2 * gutter;
    const card = width - edge - gutter - peek;
    assert.ok(card > 200 && card <= 448, "Usable phone card width");
    close(width - (edge + card + gutter), peek, "Second card visible by two gutters");
    const trackWidth = 2 * edge + 2 * card + gutter;
    const maximumScroll = trackWidth - width;
    close(edge + 2 * card + gutter - maximumScroll, width - edge, "Final card retains right grid edge");
  }
});

test("Video retains desktop timeline/pinning classes and mobile's higher initial scale", () => {
  const source = read("src/components/sections/video-explainer/video-explainer.tsx");
  const expected = {
  "scrollTrack": "[view-timeline-name:--video-explainer] md:motion-safe:supports-[animation-timeline:view()]:h-[200svh] md:motion-safe:supports-[animation-timeline:view()]:py-0",
  "scrollStage": "md:motion-safe:supports-[animation-timeline:view()]:sticky md:motion-safe:supports-[animation-timeline:view()]:top-0 md:motion-safe:supports-[animation-timeline:view()]:flex md:motion-safe:supports-[animation-timeline:view()]:h-svh md:motion-safe:supports-[animation-timeline:view()]:items-center md:motion-safe:supports-[animation-timeline:view()]:pt-21",
  "scrollScale": "[--scroll-scale-from:0.95] md:[--scroll-scale-from:0.75] motion-safe:supports-[animation-timeline:view()]:will-change-[scale] motion-safe:supports-[animation-timeline:view()]:animate-scroll-scale-in motion-safe:supports-[animation-timeline:view()]:[animation-timeline:--video-explainer] md:motion-safe:supports-[animation-timeline:view()]:[animation-range:entry_0%_contain_60%]"
};
  for (const [name, classes] of Object.entries(expected)) {
    assert.equal(source.match(new RegExp(`const ${name} =\\s*"([^"]+)"`))[1], classes);
  }
  for (const path of ["src/app/page.tsx", "src/app/homepage/page.tsx"]) assert.match(read(path), /<Hero \/>\s*<VideoExplainer \/>/);
});

test("Mobile video pins below the header with symmetric compact-stage padding", () => {
  const source = read("src/components/sections/video-explainer/video-explainer.tsx");
  const motion = read("src/components/sections/video-explainer/video-explainer.module.css");
  for (const name of ["section", "stage", "poster"]) assert.ok(source.includes(`styles.${name}`));
  assert.match(motion, /@media \(width < 48rem\)/);
  assert.match(motion, /padding-block: 0;/);
  assert.match(motion, /\.stage\s*\{\s*padding-block: var\(--space-section-media\);/);
  assert.doesNotMatch(motion, /padding-(?:top|bottom):/);
  assert.match(motion, /@supports \(animation-timeline: view\(\)\)\s*\{\s*@media \(prefers-reduced-motion: no-preference\)/);
  assert.match(motion, /--video-poster-height: calc\(\(100vw - 2 \* var\(--grid-margin\)\) \* 644 \/ 1144\)/);
  assert.match(motion, /--video-scroll-distance: 20svh;/);
  assert.match(motion, /--video-stage-height: calc\(var\(--video-poster-height\) \+ 2 \* var\(--space-section-media\)\)/);
  assert.match(motion, /height: calc\(var\(--video-stage-height\) \+ var\(--video-scroll-distance\)\)/);
  assert.match(motion, /--video-pin-top: 6rem;/);
  assert.doesNotMatch(motion, /100dvh/);
  assert.match(motion, /position: sticky;\s*top: var\(--video-pin-top\)/);
  assert.match(motion, /view-timeline-inset: var\(--video-pin-top\) 0/);
  assert.match(motion, /animation-range: exit-crossing 0px exit-crossing var\(--video-scroll-distance\)/);
  assert.match(motion, /transform-origin: center/);
  assert.doesNotMatch(motion, /height:\s*\d+(?:s|d)?vh/);
  for (const [width, height] of [[320, 568], [390, 852], [430, 932], [767, 390]]) {
    const poster = (width - 2 * rule("--space-page-inline").at(width)) * 644 / 1144;
    const padding = rule("--space-section-media").at(width);
    const stage = poster + 2 * padding;
    const travel = height * 0.2;
    const track = stage + travel;
    close(track - stage, travel, "Pin distance equals animation distance");
    // Pin offset no longer grows with viewport height; scale stays centered
    // in the compact stage, rather than generating blank space above it.
    const pinTop = 6 * 16;
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const scaledPoster = poster * (0.95 + progress * 0.05);
      const posterInset = padding + (poster - scaledPoster) / 2;
      close(pinTop + posterInset + scaledPoster / 2, pinTop + stage / 2, "Stage center is stable during scaling");
      close(posterInset, stage - posterInset - scaledPoster, "Equal stage space above and below");
      assert.ok(posterInset <= padding + poster * 0.025 + 1e-8, "No viewport-sized blank space above poster");
    }
    assert.ok(travel < height, "Mobile travel is shorter than desktop's 100svh pin");
    assert.ok(track < height * 2, "Mobile track is shorter than desktop's 200svh track");
  }
  close(rule("--space-section-opening-end").at(390) + rule("--space-section-media").at(390), 64, "Combined mobile minimum padding");
  close(rule("--space-section-opening-end").at(1440) + rule("--space-section-media").at(1440), 180, "Desktop static separation");
});

test("Mobile Hero removes the extra header allowance from centered top space", () => {
  const hero = read("src/components/sections/hero/hero.tsx");
  assert.match(hero, /min-h-\[calc\(100vh-6rem\)\]/);
  assert.match(hero, /items-center/);
  assert.match(hero, /py-\(--space-section-opening-end\)/);
  assert.match(hero, /md:min-h-0/);
  // With content fitting, removing 96px from the centered frame reduces
  // perceived top whitespace by 48px, rather than merely changing padding
  // that flex centering would redistribute back into the same empty space.
  const viewport = 852, header = 96, content = 628;
  const before = (viewport - content) / 2;
  const after = (viewport - header - content) / 2;
  close(before - after, header / 2, "Effective top-space reduction");
});

test("Mobile Hero preserves the Figma dashboard crop without changing its shared canvas", () => {
  const hero = read("src/components/sections/hero/hero.tsx");
  assert.match(hero, /overflow-x-clip/);
  assert.match(hero, /md:overflow-visible/);
  assert.match(hero, /data-slot="hero-dashboard" className="col-span-12 w-\[640px\] min-w-full md:w-auto md:min-w-0 lg:col-start-2 lg:col-end-12"/);
  assert.match(hero, /The AI Workspace<br className="md:hidden" \/>/);
  assert.match(hero, /<ProductDashboard \/>/);
  assert.doesNotMatch(hero, /"use client"|translate-|absolute[^"\n]*640/);
  const dashboard = read("src/components/visuals/product-dashboard/product-dashboard.tsx");
  assert.match(dashboard, /width=\{DASHBOARD_WIDTH\} height=\{DASHBOARD_HEIGHT\}/);
});

test("Video sizes mirror accounts for fluid page padding and ten grid columns", () => {
  const source = read("src/components/sections/video-explainer/video-explainer.tsx");
  const sizes = source.match(/sizes="([^"]+)"/)[1];
  const expression = sizes.match(/clamp\(([\d.]+)rem, calc\(([\d.]+)rem \+ ([\d.]+) \* \(\(100vw - ([\d.]+)rem\) \/ ([\d.]+)\)\), ([\d.]+)rem\)/);
  assert.ok(expression);
  const [, min, base, delta, start, span, max] = expression.map(Number);
  const margin = rule("--space-page-inline");
  assert.match(sizes, /\+ 16px\) \* 10 \/ 12 - 16px/);
  assert.match(sizes, /^\(min-width: 1440px\) 1144px, \(min-width: 1024px\)/);
  for (const width of widths) {
    const inset = Math.min(max * 16, Math.max(min * 16, base * 16 + delta * (width - start * 16) / span));
    close(inset, margin.at(width) * 2, "Two page edges");
    const content = Math.min(width - margin.at(width) * 2, 1376);
    const rendered = width >= 1024 ? (content + 16) * 10 / 12 - 16 : content;
    const hinted = width >= 1440 ? 1144 : width >= 1024 ? (width - inset + 16) * 10 / 12 - 16 : width - inset;
    close(hinted, rendered, "Responsive source width");
  }
});

test("Spacing documentation is discoverable and uses actual CSS specimens", () => {
  const page = read("src/app/design-system/spacing/page.tsx");
  assert.match(page, /Responsive Spacing System/);
  assert.match(page, /responsive>/);
  assert.match(page, /var\(\$\{token\.name\}\)/);
  assert.doesNotMatch(page, /use client/);
  for (const file of ["src/app/design-system/page.tsx", "src/app/design-system/_components/docs-sidebar.tsx"]) assert.match(read(file), /\/design-system\/spacing/);
});
