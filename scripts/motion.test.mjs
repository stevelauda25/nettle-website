import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path), "utf8");

function walk(dir, out = []) {
  const absolute = resolve(root, dir);
  if (!existsSync(absolute)) return out;
  for (const name of readdirSync(absolute)) {
    const path = `${dir}/${name}`;
    if (statSync(resolve(root, path)).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const SOURCE = /\.(?:ts|tsx|mjs|css)$/;
const LAB_DIRS = ["src/motion-lab", "src/app/motion-lab"];
const isLab = (path) => LAB_DIRS.some((dir) => path.startsWith(`${dir}/`));

/**
 * The registry, read from source in the same style as the other suites, so
 * this test needs no bundler: registry.ts lists section identifiers in
 * production order; each identifier maps to a section folder's index.ts.
 */
function loadRegistry() {
  const source = read("src/motion-lab/registry.ts");
  const imports = new Map(
    [...source.matchAll(/^import (\w+) from "\.\/sections\/([\w-]+)";/gm)].map((m) => [m[1], m[2]]),
  );
  const list = source.match(/export const sections: readonly SectionMeta\[\] = \[([^\]]+)\];/)[1];
  const order = list.split(",").map((s) => s.trim()).filter(Boolean);
  return order.map((identifier) => {
    const folder = imports.get(identifier);
    assert.ok(folder, `registry: ${identifier} is imported from ./sections/<folder>`);
    const meta = read(`src/motion-lab/sections/${folder}/index.ts`);
    const field = (name) => meta.match(new RegExp(`^\\s*${name}: "([^"]+)"`, "m"))?.[1];
    const conceptsBlock = meta.match(/concepts: \[([\s\S]*?)\n\s*\],?\n\};/)?.[1] ?? meta.match(/concepts: \[\s*\]/)?.[0] ?? "";
    const concepts = [...conceptsBlock.matchAll(/\{[\s\S]*?\}/g)].map((block) => ({
      id: block[0].match(/id: "([^"]+)"/)?.[1],
      state: block[0].match(/state: "([^"]+)"/)?.[1],
    }));
    return { folder, id: field("id"), componentName: field("componentName"), path: field("path"), kind: field("kind"), concepts };
  });
}

test("Production code never imports the Motion Lab", () => {
  const offenders = walk("src")
    .filter((path) => SOURCE.test(path) && !isLab(path))
    .filter((path) => /@\/motion-lab|["'](?:\.\.\/)+motion-lab\//.test(read(path)));
  assert.deepEqual(offenders, []);
});

test("The motion core knows nothing about the lab or the stage", () => {
  for (const path of walk("src/motion").filter((path) => SOURCE.test(path))) {
    assert.doesNotMatch(read(path), /from ["'][^"']*motion-lab|postMessage|from ["']dialkit/, path);
  }
});

test("No animation or tuning libraries are installed or imported", () => {
  const pkg = JSON.parse(read("package.json"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of ["dialkit", "motion", "framer-motion", "gsap", "lenis", "@studio-freight/lenis", "animejs", "@react-spring/web"]) {
    assert.equal(deps[name], undefined, name);
  }
  for (const path of walk("src").filter((path) => SOURCE.test(path))) {
    assert.doesNotMatch(read(path), /from ["'](?:dialkit|motion(?:\/[\w-]+)?|framer-motion|gsap(?:\/[\w-]+)?|lenis)["']/, path);
  }
});

test("Client boundaries stay out of sections and visuals", () => {
  const allowed = [
    "src/components/sections/business-lines/business-line-carousel.tsx",
    "src/components/sections/features/features-carousel.tsx",
    "src/components/sections/testimonial/testimonial-carousel.tsx",
    "src/components/ui/carousel-controls.tsx",
  ];
  const clients = walk("src/components")
    .filter((path) => /\.tsx?$/.test(path) && /^\s*["']use client["']/m.test(read(path)))
    .sort();
  assert.deepEqual(clients, allowed);
  for (const path of ["src/app/page.tsx", "src/app/homepage/page.tsx", "src/app/layout.tsx"]) {
    assert.doesNotMatch(read(path), /use client|motion-lab|@\/motion\b/, path);
  }
});

test("Motion Lab routes are development-only and load the lab lazily", () => {
  const routes = walk("src/app/motion-lab").filter((path) => /\.tsx$/.test(path));
  assert.ok(routes.length >= 4, "expected layout, index, entry and stage routes");
  for (const path of routes) {
    const source = read(path);
    assert.doesNotMatch(source, /NEXT_PUBLIC_MOTION_LAB/, path);
    assert.match(source, /notFound\(\);/, path);
    if (path.endsWith("page.tsx")) {
      // Lab imports are dynamic and sit inside a branch on the build-time
      // constant, so a production build drops the branch and its modules.
      assert.doesNotMatch(source, /^import .* from ["']@\/motion-lab/m, `${path}: lab imports must be dynamic`);
      const branch = source.indexOf('if (process.env.NODE_ENV !== "production") {');
      const firstImport = source.indexOf('import("@/motion-lab');
      assert.ok(branch !== -1 && firstImport > branch, `${path}: lab imports inside the development branch`);
      assert.ok(source.lastIndexOf("notFound();") > source.lastIndexOf('import("@/motion-lab'), `${path}: production path ends in notFound()`);
    }
  }
  assert.match(read("src/app/motion-lab/layout.tsx"), /if \(process\.env\.NODE_ENV === "production"\) notFound\(\);/);
  assert.match(read("src/app/motion-lab/layout.tsx"), /robots: \{ index: false/);
});

test("The registry mirrors the homepage composition, in order", () => {
  const page = read("src/app/page.tsx");
  const gridImports = page.match(/import \{([^}]+)\} from "@\/components\/layout\/grid"/)[1].split(",").map((s) => s.trim());
  const rendered = [...page.matchAll(/<([A-Z][A-Za-z]+) \/>/g)].map((m) => m[1]).filter((name) => !gridImports.includes(name));
  const registry = loadRegistry();
  assert.deepEqual(registry.map((section) => section.componentName), rendered, "registry order must follow src/app/page.tsx");
  const originals = read("src/motion-lab/stage/originals.ts");
  for (const section of registry) {
    assert.equal(section.id, section.folder, `${section.folder}: id matches its folder`);
    assert.ok(existsSync(resolve(root, section.path)), `${section.id}: ${section.path} exists`);
    const original = read(`src/motion-lab/sections/${section.id}/original.tsx`);
    assert.match(original, new RegExp(`<${section.componentName} />`), `${section.id}: Original renders the real component`);
    assert.doesNotMatch(original, /use client/, `${section.id}: Original stays a server component`);
    assert.doesNotMatch(original, /<(?:section|div|main|header|footer)\b/, `${section.id}: Original adds no markup`);
    assert.match(originals, new RegExp(`sections/${section.id}/original`), `${section.id}: stage can resolve the Original`);
  }
});

test("Every Concept folder carries an approved storyline (Gate 1) and a registry entry", () => {
  for (const section of loadRegistry()) {
    const dir = `src/motion-lab/sections/${section.id}`;
    const folders = readdirSync(resolve(root, dir)).filter((name) => statSync(resolve(root, dir, name)).isDirectory());
    for (const folder of folders) {
      const storyline = `${dir}/${folder}/storyline.md`;
      assert.ok(existsSync(resolve(root, storyline)), `${storyline} is required before any Concept code`);
      const text = read(storyline);
      for (const heading of ["## Intent", "## Beats", "## Reduced motion", "## Approval"]) {
        assert.match(text, new RegExp(`^${heading}`, "m"), `${storyline}: ${heading}`);
      }
      const concept = section.concepts.find((item) => item.id === folder);
      assert.ok(concept, `${section.id}/${folder}: registered in the section registry`);
      const hasCode = readdirSync(resolve(root, dir, folder)).some((name) => /\.(?:tsx|ts|css)$/.test(name));
      if (hasCode || concept.state !== "storyline") {
        assert.match(text, /^Approved by: \S.*\bon\b \d{4}-\d{2}-\d{2}/m, `${storyline}: Gate 1 approval line`);
      }
    }
    for (const concept of section.concepts) assert.ok(folders.includes(concept.id), `${section.id}/${concept.id}: folder exists`);
  }
});

test("Live motion stays in src/motion/sections and animates only compositor-safe properties", () => {
  for (const path of walk("src/motion/sections")) {
    if (path.endsWith(".spec.ts")) assert.match(read(path), /Approved by: /, `${path}: provenance of the approved snapshot`);
  }
  for (const path of walk("src/motion").filter((path) => path.endsWith(".css"))) {
    assert.doesNotMatch(
      read(path),
      /^\s*(?:width|height|margin(?:-\w+)?|padding(?:-\w+)?|top|left|right|bottom|font-size|line-height)\s*:/m,
      `${path}: layout properties are not animated`,
    );
  }
});

test("Existing suites remain and every suite is wired into package.json", () => {
  for (const path of ["scripts/performance.test.mjs", "scripts/spacing.test.mjs", "scripts/typography.test.mjs", "scripts/usage-guidelines.test.mjs"]) {
    assert.ok(existsSync(resolve(root, path)), path);
  }
  const pkg = JSON.parse(read("package.json"));
  for (const script of ["test:typography", "test:spacing", "test:performance", "test:usage", "test:motion", "test"]) {
    assert.ok(pkg.scripts[script], `package.json script ${script}`);
  }
});
