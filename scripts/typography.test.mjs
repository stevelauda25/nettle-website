import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { typographyStyles, responsiveTypography } from "../src/app/design-system/_data/foundation.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");
const css = read("src/app/globals.css");
const widths = [320, 390, 768, 1024, 1280, 1440, 1920];
const close = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 1e-8, `${label}: ${actual} vs ${expected}`);
const property = (name) => {
  const result = css.match(new RegExp(`${name}:\\s*([^;]+);`));
  assert.ok(result, `Missing ${name}`);
  return result[1];
};
const minimumViewportRem = Number.parseFloat(property("--type-viewport-min"));
const viewportSpanRem = Number(property("--type-viewport-span"));
const utility = (name) => {
  const result = css.match(new RegExp(`@utility ${name} \\{([^}]+)\\}`));
  assert.ok(result, `Missing ${name}`);
  return Object.fromEntries([...result[1].matchAll(/([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]]));
};

function sizeRule(style) {
  const fontSize = utility(style.className)["font-size"];
  if (style.scaling === "fixed") {
    assert.match(fontSize, /^\d+(\.\d+)?px$/);
    return { min: Number.parseFloat(fontSize), max: Number.parseFloat(fontSize), at: () => Number.parseFloat(fontSize) };
  }
  const variable = fontSize.match(/^var\((--type-size-[\w-]+)\)$/);
  assert.ok(variable, `${style.className}: size must come from the shared foundation`);
  const parts = property(variable[1]).match(/^clamp\(([\d.]+)rem, calc\(([\d.]+)rem \+ ([\d.]+) \* var\(--type-fluid-step\)\), ([\d.]+)rem\)$/);
  assert.ok(parts, `${style.className}: must use the common interpolation formula`);
  const [, min, base, delta, max] = parts.map(Number);
  close(min, base, "Fluid base");
  close(delta, max - min, "Fluid delta");
  return {
    min: min * 16, max: max * 16,
    at: (width, rootSize = 16) => Math.min(max * rootSize, Math.max(min * rootSize,
      base * rootSize + delta * (width - minimumViewportRem * rootSize) / viewportSpanRem)),
  };
}

// Independent approved audit: [min, original desktop max, leading %, tracking %, weight].
const approved = {
  "text-heading-h1": [40, 64, 100, -1, 300],
  "text-heading-h2": [34, 56, 100, -2, 300],
  "text-heading-h3": [32, 52, 100, -1, 300],
  "text-heading-h4": [30, 48, 100, -1, 300],
  "text-heading-h5": [22, 32, 110, 0, 400],
  "text-heading-h6": [20, 24, 100, 0, 400],
  "text-heading-card": [28, 32, 100, 0, 400],
  "text-body-large-regular": [15, 18, 110, 0, 400],
  "text-body-large-medium": [15, 18, 110, 0, 500],
  "text-body-medium-regular": [14, 16, 140, 0, 400],
  "text-body-medium-medium": [14, 16, 140, 0, 500],
  "text-body-small-regular": [14, 14, 140, 1, 400],
  "text-body-small-medium": [14, 14, 140, 1, 500],
  "text-display-statement": [32, 54, 110, -2, 300],
  "text-handwritten": [16, 16, 120, -2, 400],
};

test("CSS and docs share one rem-based 390–1440 range", () => {
  assert.equal(property("--type-fluid-step"), "calc((100vw - var(--type-viewport-min)) / var(--type-viewport-span))");
  assert.deepEqual([responsiveTypography.minViewport, responsiveTypography.maxViewport, responsiveTypography.defaultRootSize], [390, 1440, 16]);
  close(minimumViewportRem * 16, 390, "Minimum viewport");
  close((minimumViewportRem + viewportSpanRem) * 16, 1440, "Maximum viewport");
  const cssRoles = [...css.matchAll(/@utility (text-(?:heading-\w+|body-[\w-]+|handwritten|display-statement))\s*\{/g)].map((m) => m[1]).sort();
  assert.deepEqual(cssRoles, typographyStyles.map((s) => s.className).sort());
  assert.equal(typographyStyles.length, Object.keys(approved).length);
});

for (const style of typographyStyles) {
  test(`${style.className}: approved metrics, bounded scale and metadata agreement`, () => {
    assert.deepEqual([style.minSize, style.size, style.lineHeight, style.letterSpacing, style.weight], approved[style.className]);
    assert.equal(style.scaling, style.minSize === style.size ? "fixed" : "fluid");
    const rules = utility(style.className);
    const font = style.family === "crimson" ? "heading" : style.family === "suisse" ? "body" : "handwritten";
    assert.equal(rules["font-family"], `var(--font-${font})`);
    assert.equal(Number(rules["font-weight"]), style.weight);
    close(Number(rules["line-height"]), style.lineHeight / 100, "Line height");
    close(Number.parseFloat(rules["letter-spacing"]), style.letterSpacing / 100, "Tracking");
    const rule = sizeRule(style);
    close(rule.min, style.minSize, "Minimum");
    close(rule.max, style.size, "Maximum");
    let previous = -Infinity;
    const denseWidths = [...new Set([...widths, ...Array.from({ length: 161 }, (_, i) => 320 + i * 10)])].sort((a, b) => a - b);
    for (const width of denseWidths) {
      const actual = rule.at(width);
      const expected = style.minSize + (style.size - style.minSize) * Math.min(1, Math.max(0, (width - 390) / 1050));
      close(actual, expected, `${width}px`);
      assert.ok(actual >= previous && actual >= rule.min && actual <= rule.max);
      previous = actual;
    }
    close(rule.at(390), style.minSize, "Exact minimum endpoint");
    close(rule.at(1440), style.size, "Exact desktop endpoint");
    if (style.scaling === "fluid") {
      for (const rootSize of [20, 32]) {
        close(rule.at(390 * rootSize / 16, rootSize), style.minSize * rootSize / 16, "Enlarged root minimum");
        close(rule.at(1440 * rootSize / 16, rootSize), style.size * rootSize / 16, "Enlarged root maximum");
      }
    }
  });
}

test("Body weight variants scale identically; UI keeps fixed body-small", () => {
  for (const role of ["large", "medium", "small"]) {
    const regular = typographyStyles.find((s) => s.className === `text-body-${role}-regular`);
    const medium = typographyStyles.find((s) => s.className === `text-body-${role}-medium`);
    for (const width of widths) close(sizeRule(regular).at(width), sizeRule(medium).at(width), role);
  }
  assert.match(read("src/components/ui/button.tsx"), /text-body-small-medium/);
  assert.match(read("src/components/layout/site-header.tsx"), /text-body-small-regular/);
});

test("Hero typography is excluded from the mobile reduction", () => {
  const source = read("src/components/sections/hero/hero.tsx");
  assert.match(source, /text-heading-h1/);
  assert.match(source, /text-body-medium-regular[^\n]+\[--type-size-body-medium:1rem\]/);
  const h1 = sizeRule(typographyStyles.find((s) => s.className === "text-heading-h1"));
  close(h1.at(390), 40, "Original Hero minimum");
  close(h1.at(1440), 64, "Original Hero maximum");
});

test("Sections consume shared roles without local clamps or arbitrary breakpoint type swaps", () => {
  const files = readdirSync(resolve(root, "src/components/sections"), { recursive: true });
  for (const path of files.filter((p) => p.endsWith(".tsx") || p.endsWith(".css"))) {
    // Product mockups retain approved illustration-coordinate typography.
    if (path.split(/[\\/]/).includes("visuals")) continue;
    const source = read(`src/components/sections/${path}`);
    assert.doesNotMatch(source, /(?:sm|md|lg|xl|2xl):text-(?:heading|body)/, path);
    assert.doesNotMatch(source, /text-\[clamp\(|font-size:\s*clamp\(/, path);
  }
  for (const path of ["features/features-carousel", "business-lines/business-line-carousel", "testimonial/testimonial-carousel", "security/security", "cta/cta"]) {
    assert.match(read(`src/components/sections/${path}.tsx`), /text-heading-h3/);
  }
  assert.match(read("src/components/sections/challenge-today/challenge-today.tsx"), /text-display-statement/);
  assert.match(read("src/app/design-system/typography/page.tsx"), /Responsive Typography Scaling/);
});

test("CTA mobile consumes its approved compact role without changing H5 or desktop H3", () => {
  const source = read("src/components/sections/cta/cta.tsx");
  const cardCss = read("src/components/sections/cta/cta.module.css");
  assert.match(source, /text-heading-h3/);
  assert.match(cardCss, /@reference "\.\.\/\.\.\/\.\.\/app\/globals\.css"/);
  assert.match(cardCss, /@media \(width < 48rem\)/);
  assert.match(cardCss, /@apply text-heading-card/);
  assert.doesNotMatch(cardCss, /font-size:|font-weight:|line-height:/);
  assert.equal(utility("text-heading-card")["font-size"], "var(--type-size-heading-card)");
  assert.equal(utility("text-heading-card")["line-height"], "1");
  assert.equal(utility("text-heading-h5")["line-height"], "1.1");
  assert.match(cardCss, /text-wrap: balance/);
});

test("Carousel headings stay left-aligned and balanced with desktop-only controls", () => {
  for (const path of ["features/features-carousel", "business-lines/business-line-carousel", "testimonial/testimonial-carousel"]) {
    const source = read(`src/components/sections/${path}.tsx`);
    assert.match(source, /col-span-12[^"\n]*text-left lg:col-start-2 lg:col-end-12/);
    assert.match(source, /<h2[^>]+className="[^"]*text-balance/);
    assert.doesNotMatch(source, /CarouselArrow|<button|text-center|useState|useEffect|ResizeObserver/);
    assert.match(source, /tabIndex=\{0\}/);
    assert.match(source, /onKeyDown/);
    assert.match(source, /event.target !== event.currentTarget/);
    assert.match(source, /<CarouselControls\s/);
  }
  const controls = read("src/components/ui/carousel-controls.tsx");
  assert.match(controls, /className="hidden[^"\n]*md:flex"/);
  assert.match(controls, /direction="previous"/);
  assert.match(controls, /direction="next"/);
  assert.match(controls, /aria-controls=\{trackId\}/);
  assert.match(controls, /disabled=\{!available.previous\}/);
  assert.match(controls, /disabled=\{!available.next\}/);
});

test("Challenge targets three mobile lines without clipping text or changing desktop breaks", () => {
  const source = read("src/components/sections/challenge-today/challenge-today.tsx");
  assert.match(source, /firstLine: "90% of your time is spent at the desk\."/);
  assert.match(source, /secondLineLead: "Your expertise "/);
  assert.match(source, /emphasis: "belongs in the field\."/);
  assert.match(source, /<br className="hidden md:block" \/>\s*\{" "\}/);
  assert.match(source, /<span className="inline-block">\{state.secondLineLead.trim\(\)\}<\/span>\s*\{" "\}/);
  assert.match(source, /className="relative inline-block text-brand-50"/);
  assert.match(source, /state-1-underline\.svg/);
  assert.doesNotMatch(source, /line-clamp|truncate|whitespace-nowrap/);
  assert.match(source, /text-display-statement text-balance/);
  assert.match(source, /max-md:\[--grid-margin:var\(--space-related-gap\)\]/);
  assert.equal(property("--space-related-gap"), "0.75rem");
  assert.match(source, /<Container className="h-full">/);
  const display = sizeRule(typographyStyles.find((s) => s.className === "text-display-statement"));
  close(display.at(390), 32, "Refined mobile minimum");
  close(display.at(1440), 54, "Unchanged desktop maximum");
});
