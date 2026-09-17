import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const data = read("src/app/design-system/_data/usage.ts");

test("All usage pages are discoverable, server-rendered and use responsive docs", () => {
  const sidebar = read("src/app/design-system/_components/docs-sidebar.tsx");
  const index = read("src/app/design-system/page.tsx");
  const shell = read("src/app/design-system/_components/usage-guide.tsx");
  assert.match(shell, /responsive smoothAnchorScroll/);
  assert.doesNotMatch(shell, /use client/);
  for (const route of ["radius", "logo", "imagery"]) {
    assert.ok(sidebar.includes(`/design-system/${route}`));
    assert.ok(index.includes(`/design-system/${route}`));
    const page = read(`src/app/design-system/${route}/page.tsx`);
    assert.match(page, /<UsageGuide/);
    assert.doesNotMatch(page, /use client/);
    for (const [, src] of page.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
      assert.ok(existsSync(fileURLToPath(new URL(`public${src}`, root))), src);
    }
  }
});

test("Radius guidance mirrors installed utilities and real card families", () => {
  const theme = read("node_modules/tailwindcss/theme.css");
  for (const [role, value] of [["xs", "0.125"], ["sm", "0.25"], ["md", "0.375"], ["lg", "0.5"]]) {
    assert.ok(theme.includes(`--radius-${role}: ${value}rem;`));
    assert.ok(data.includes(`--radius-${role} = ${value}rem`));
  }
  for (const [path, radius] of [
    ["ui/button.tsx", "rounded-md"],
    ["sections/testimonial/testimonial.tsx", "rounded-md"],
    ["sections/cta/cta.tsx", "rounded-md"],
    ["sections/features/features.tsx", "rounded-lg"],
    ["sections/business-lines/business-lines.tsx", "rounded-lg"],
    ["sections/solutions-by-role/role-card.tsx", "rounded-lg"],
    ["sections/security/security-card.tsx", "rounded-lg"],
    ["sections/video-explainer/video-explainer.tsx", "rounded-xs"],
  ]) assert.ok(read(`src/components/${path}`).includes(radius), path);
});

test("Logo facts match the master and reference limitations remain explicit", () => {
  const master = read("public/assets/logos/nettle.svg");
  assert.match(master, /viewBox="0 0 143 17"/);
  assert.match(master, /preserveAspectRatio="none"/);
  assert.match(master, /fill="#03010E"/);
  assert.match(read("src/app/design-system/logo/page.tsx"), /user-supplied Colour usage/);
  assert.match(data, /Numerical clear-space ratios.*not defined in the supplied reference/);
  assert.match(data, /Dark mode:.*orange symbol and cream wordmark/);
  assert.match(data, /Light mode:.*cream background with a black symbol and black wordmark/);
  assert.match(data, /Use Nettle in written language/);
  assert.match(data, /Nettle_colored_logo_transp_dark_background:.*black wordmark/);
  assert.match(data, /Nettle_colored_logo_transp_light_background:.*cream wordmark/);
});

test("Logo specimens preserve master paths and replace the screenshot with five treatments", () => {
  const master = read("public/assets/logos/nettle.svg");
  const specimenData = read("src/app/design-system/logo/_components/logo-paths.ts");
  const originals = [...master.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1]);
  const copies = [...specimenData.matchAll(/"d": "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(originals.length, 6);
  assert.deepEqual(copies, originals);
  assert.equal((data.match(/transparent: (?:true|false)/g) || []).length, 5);
  const page = read("src/app/design-system/logo/page.tsx");
  assert.match(page, /<LogoSpecimen/);
  assert.doesNotMatch(page, /logo-colour-reference\.png/);
  assert.equal(existsSync(new URL("public/assets/images/design-system/logo-colour-reference.png", root)), false);
  const component = read("src/app/design-system/logo/_components/logo-specimen.tsx");
  assert.match(component, /viewBox="0 0 79 17"/);
  assert.match(component, /index === 0 \? symbol : wordmark/);
  for (const token of ["warm-gray-100", "brand-500", "cold-gray-500"]) assert.ok(component.includes(`--color-${token}`));
  assert.doesNotMatch(component, /use client|dangerouslySetInnerHTML/);
});

test("Historical imagery direction does not certify undated existing assets", () => {
  assert.match(data, /before 1900/);
  assert.match(data, /Mark unknown dates as unverified/);
  assert.match(data, /modern illustration.*interpretation, not an archival document/);
  assert.match(data, /riso-surveyor\.png contains electronic equipment/);
  assert.match(data, /Product UI screenshots and evidence thumbnails are a separate lane/);
  assert.match(data, /Confirm permission and required credit/);
});
