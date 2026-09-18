import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { sharp } from "./generate-lossless-assets.mjs";
import { challengeCamera as camera, challengeTiles as tiles, challengeStates as states, challengeMotion as motion, challengeTileMotion as tileMotion, getChallengeTileMotion } from "../src/components/sections/challenge-today/challenge-data.ts";

const require = createRequire(import.meta.url);
const folder = "src/components/sections/challenge-today/";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const source = read(`${folder}challenge-today.tsx`);
const artwork = read(`${folder}challenge-artwork.tsx`);
const rawCss = read(`${folder}challenge-today.module.css`);
const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, "");
const close = (a, b, epsilon = 1e-8) => assert.ok(Math.abs(a - b) < epsilon, `${a} != ${b}`);

// Independent numerical evidence copied from Figma metadata (x, y, width,
// height), in Rectangle order 62, 63, 68, 66, 69, 64, 67, 70, 65.
// These are design-coordinate safeguards, NOT a browser layout/render test.
const frameTileIds = ["62", "63", "68", "66", "69", "64", "67", "70", "65"];
const frames = [
  [
    [559.561279296875, -368.17041015625, 394.6021423339844, 361.7186584472656],
    [1268.4052734375, -1371.036865234375, 772.7625732421875, 861.5480346679688],
    [-12.54443359375, 1836.44287109375, 772.7625732421875, 861.5480346679688],
    [-674.100341796875, -1841, 943.7568359375, 1052.272216796875],
    [1478.39453125, 1491.8056640625, 943.7568359375, 1052.272216796875],
    [-2418.989990197122, -1314.8657836914062, 937.18017578125, 1045.695556640625],
    [-2203.8868865966797, 1050.159423828125, 950.33349609375, 1078.5791015625],
    [-706.6414794921875, 1187.236572265625, 379.884521484375, 434.7132568359375],
    [2631.27783203125, -430.30078125, 1496.199951171875, 1670.482666015625],
  ],
  [
    [736.8004150390625, 110.98626708984375, 157.26654052734375, 144.16099548339844],
    [1019.3072509765625, -288.6979522705078, 307.9803161621094, 343.3652648925781],
    [508.79278564453125, 989.625244140625, 307.9803161621094, 343.3652648925781],
    [245.13092041015625, -476, 376.1291198730469, 419.37738037109375],
    [1102.9947509765625, 852.269775390625, 376.1291198730469, 419.37738037109375],
    [-450.28374084830284, -266.31141662597656, 373.5080261230469, 416.75628662109375],
    [-364.5574035644531, 676.2576904296875, 378.7502136230469, 429.86181640625],
    [232.16168212890625, 730.88916015625, 151.40090942382812, 173.2526092529297],
    [1562.47021484375, 86.22503662109375, 596.3023681640625, 665.76171875],
  ],
  [
    [761.8604125976562, 178.73440551757812, 123.7092056274414, 113.40010833740234],
    [984.0870361328125, -135.66522216796875, 242.2638702392578, 270.0984191894531],
    [582.504638671875, 869.891845703125, 242.2638702392578, 270.0984191894531],
    [375.10394287109375, -283, 295.8711853027344, 329.89117431640625],
    [1049.91748046875, 761.8450927734375, 295.8711853027344, 329.89117431640625],
    [-171.926640085876, -118.05534362792969, 293.8093566894531, 327.8293762207031],
    [-104.49230194091797, 623.3905029296875, 297.9329833984375, 338.1384582519531],
    [364.89935302734375, 666.3658447265625, 119.09517669677734, 136.28419494628906],
    [1411.348388671875, 159.2593994140625, 469.06414794921875, 523.7023315429688],
  ],
];

for (const [index, progress] of [[0, 0], [2, 0.85]]) {
  test(`State 0${index + 1}: all nine tiles reproduce Figma within 0.025 design pixels`, () => {
    assert.equal(tiles.length, 9);
    for (const viewport of ["mobile", "desktop"]) tiles.forEach((tile) => {
      const i = frameTileIds.indexOf(tile.id);
      const actual = rectAt(tile, viewport, progress);
      actual.forEach((n, j) => close(n, frames[index][i][j], 0.025));
      close(actual[2] / actual[3], tile.width / tile.height);
    });
  });
}

// Parse the actual CSS keyframes; tests cannot pass from a separate storyboard
// implementation while the real stops accidentally drift.
function stops(name, property) {
  const block = css.split(`@keyframes ${name} {`)[1].split("\n}")[0];
  const values = { "--challenge-scale-start": camera.startScale, "--challenge-scale-middle": camera.middleScale, "--challenge-scale-end": camera.endScale };
  return [...block.matchAll(/([\d%,\s]+)\{([^}]+)\}/g)].flatMap((match) => {
    let value;
    if (property === "opacity") value = Number(match[2].match(/opacity: ([\d.]+)/)[1]);
    else if (property === "blur") value = match[2].includes("blur(0px)") ? 0 : 1;
    else if (property === "copy-scale") value = match[2].includes("scale(1)") ? 1 : 0;
    else if (property === "clip") value = Number(match[2].match(/clip-path: inset\(0 ([\d.]+)% 0 0\)/)[1]);
    else value = values[match[2].match(/scale\(var\(([^)]+)\)\)/)[1]];
    return match[1].split(",").map((p) => [Number.parseFloat(p) / 100, value]);
  });
}

function valueAt(story, progress, ease = (value) => value) {
  const p = Math.min(1, Math.max(0, progress));
  const i = story.findIndex(([end]) => end >= p);
  if (i === 0) return story[0][1];
  const [start, from] = story[i - 1], [end, to] = story[i];
  return from + (to - from) * ease((p - start) / (end - start));
}

const copyBezier = css.match(/--challenge-copy-ease: cubic-bezier\(([^)]+)\)/)[1].split(",").map(Number);
const copyEase = (t) => 3 * (1 - t) ** 2 * t * copyBezier[1] + 3 * (1 - t) * t ** 2 * copyBezier[3] + t ** 3;
const copyAt = (story, p) => valueAt(story, p, copyEase);

const cameraStops = stops("pull-back", "transform");
const profiles = Object.keys(tileMotion);
const viewports = ["mobile", "desktop"];
function bezierCoordinates(easing) {
  const coords = easing.match(/^cubic-bezier\(([^)]+)\)$/)[1].split(",").map(Number);
  close(coords[0], 1 / 3);
  close(coords[2], 2 / 3);
  return coords;
}

// Evaluate the actual serialized CSS easing, not a parallel Hermite function.
// x control points at 1/3 and 2/3 make x(t)=t, so no inversion is needed.
function scaleAt(id, viewport, progress) {
  const p = Math.max(0, Math.min(1, progress));
  if (p >= cameraStops[2][0]) return cameraStops[2][1];
  const i = p < cameraStops[1][0] ? 0 : 1;
  const [start, from] = cameraStops[i], [end, to] = cameraStops[i + 1];
  const u = (p - start) / (end - start);
  const [, y1, , y2] = bezierCoordinates(tileMotion[id][viewport][i === 0 ? "first" : "second"]);
  const eased = 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3;
  return from + (to - from) * eased;
}

function zoomAt(id, viewport, progress) {
  const p = Math.max(0, Math.min(1, progress));
  if (p >= motion.holdProgress) return camera.endScale;
  const zoom = tileMotion[id].zoom[viewport];
  const i = p < motion.middleProgress ? 0 : 1;
  const stops = [[0, camera.startScale], [motion.middleProgress, zoom.middleScale], [motion.holdProgress, camera.endScale]];
  const [start, from] = stops[i], [end, to] = stops[i + 1];
  const u = (p - start) / (end - start);
  const [, y1, , y2] = bezierCoordinates(zoom[i === 0 ? "first" : "second"]);
  return from + (to - from) * (3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3);
}

function rectAt(tile, viewport, progress) {
  const travel = scaleAt(tile.id, viewport, progress);
  const zoom = zoomAt(tile.id, viewport, progress);
  const centerX = camera.originX + (tile.x + tile.width / 2 - camera.originX) * travel;
  const centerY = camera.originY + (tile.y + tile.height / 2 - camera.originY) * travel;
  return [centerX - tile.width * zoom / 2, centerY - tile.height * zoom / 2, tile.width * zoom, tile.height * zoom];
}

test("Middle centers preserve Figma paths, but all nine zoom scales stay separated", () => {
  for (const viewport of viewports) {
    const scales = new Set();
    tiles.forEach((tile) => {
      const i = frameTileIds.indexOf(tile.id);
      const actual = rectAt(tile, viewport, 0.5);
      close(actual[0] + actual[2] / 2, frames[1][i][0] + frames[1][i][2] / 2, 0.025);
      close(actual[1] + actual[3] / 2, frames[1][i][1] + frames[1][i][3] / 2, 0.025);
      scales.add(zoomAt(tile.id, viewport, 0.5));
    });
    assert.equal(scales.size, 9);
  }
  assert.ok(zoomAt("65", "desktop", 0.5) - zoomAt("62", "desktop", 0.5) > 0.6);
});

test("Independent zoom remains monotone, bounded, reversible and velocity-continuous", () => {
  for (const id of profiles) for (const viewport of viewports) {
    const at = (p) => zoomAt(id, viewport, p);
    let previous = camera.startScale;
    for (let i = 0; i <= 1000; i++) {
      const value = at(i / 1000);
      assert.ok(value >= 1 && value <= previous + 1e-10, `${id}/${viewport} zoom overshoot at ${i}`);
      close(value, at(1 - (1000 - i) / 1000));
      previous = value;
    }
    const delta = 1e-7;
    for (const p of [0.5, 0.85]) close((at(p) - at(p - delta)) / delta, (at(p + delta) - at(p)) / delta, 1e-4);
    close(at(0.95), 1);
  }
});

test("Foreground zoom stays faster throughout the visible late phase, including reverse scroll", () => {
  const speed = (id, viewport, p) => (zoomAt(id, viewport, p - 1e-6) - zoomAt(id, viewport, p + 1e-6)) / 2e-6;
  for (const p of [0.51, 0.6, 0.7, 0.78, 0.82, 0.84]) {
    assert.ok(speed("65", "desktop", p) > speed("62", "desktop", p) * 5);
    assert.ok(speed("66", "desktop", p) > speed("70", "desktop", p) * 2);
    assert.ok(speed("65", "mobile", p) > speed("62", "mobile", p) * 1.5);
    // Reverse uses the exact same mapping, with opposite velocity.
    assert.ok(zoomAt("65", "desktop", p - 0.001) > zoomAt("65", "desktop", p));
  }
  for (const p of [0.2, 0.5, 0.6, 0.7, 0.8]) for (const tile of tiles.slice(1)) {
    close(zoomAt(tile.id, "mobile", p) - zoomAt("62", "mobile", p),
      (zoomAt(tile.id, "desktop", p) - zoomAt("62", "desktop", p)) * motion.mobileDepthStrength);
  }
});

test("Actual tile curves are monotone, bounded, continuous, reversible and hold the last 15%", () => {
  assert.deepEqual(cameraStops, [[0, camera.startScale], [0.5, camera.middleScale], [0.85, 1], [1, 1]]);
  close(motion.middleProgress, cameraStops[1][0]);
  close(motion.holdProgress, cameraStops[2][0]);
  assert.match(css, /0%\s*\{[^}]*animation-timing-function: var\(--challenge-ease-first\)/);
  assert.match(css, /50%\s*\{[^}]*animation-timing-function: var\(--challenge-ease-second\)/);
  for (const depth of profiles) for (const viewport of viewports) {
    const at = (p) => scaleAt(depth, viewport, p);
    const forward = Array.from({ length: 1001 }, (_, i) => at(i / 1000));
    const backward = Array.from({ length: 1001 }, (_, i) => at((1000 - i) / 1000)).reverse();
    assert.deepEqual(forward, backward);
    forward.forEach((n, i) => {
      assert.ok(n >= 1 && n <= camera.startScale);
      if (i) assert.ok(n <= forward[i - 1]);
    });
    for (const p of [0, 0.5, 0.85, 1]) close(at(p - 1e-9), at(p + 1e-9), 1e-7);
    close(at(0.95), 1);
  }
});

test("Layer velocity is continuous at State 02 and settles to zero at the final hold", () => {
  assert.deepEqual(motion.derivatives.near, [-8, -2.3, 0]);
  assert.deepEqual(motion.derivatives.far, [-0.8, -0.25, 0]);
  close(motion.derivatives.middle[0], (camera.middleScale - camera.startScale) / 0.5);
  close(motion.derivatives.middle[1], -1.2);
  for (const depth of profiles) for (const viewport of viewports) {
    const expected = tileMotion[depth].slopes[viewport];
    for (const [i, segment] of ["first", "second"].entries()) {
      const [x1, y1, x2, y2] = bezierCoordinates(tileMotion[depth][viewport][segment]);
      const rate = (cameraStops[i + 1][1] - cameraStops[i][1]) / (cameraStops[i + 1][0] - cameraStops[i][0]);
      close(rate * y1 / x1, expected[i]);
      close(rate * (1 - y2) / (1 - x2), expected[i + 1]);
    }
    const at = (p) => scaleAt(depth, viewport, p), delta = 1e-6;
    for (const p of [0.5, 0.85]) close((at(p) - at(p - delta)) / delta, (at(p + delta) - at(p)) / delta, 1e-4);
  }
});

test("All nine images have independent curves and mobile halves their variation", () => {
  assert.equal(motion.mobileDepthStrength, 0.5);
  const byDepth = [...tiles].sort((a, b) => tileMotion[a.id].response - tileMotion[b.id].response);
  assert.equal(new Set(profiles.map((id) => tileMotion[id].desktop.first)).size, 9);
  for (const p of [0.125, 0.25, 0.375, 0.6, 0.675, 0.8]) {
    byDepth.slice(1).forEach((tile, i) => assert.ok(scaleAt(tile.id, "desktop", p) < scaleAt(byDepth[i].id, "desktop", p)));
    // Pairwise scale separation is halved, not just endpoint slope differences.
    for (const tile of tiles.slice(1)) {
      close(scaleAt(tile.id, "mobile", p) - scaleAt(tiles[0].id, "mobile", p),
        (scaleAt(tile.id, "desktop", p) - scaleAt(tiles[0].id, "desktop", p)) * 0.5);
    }
  }
  const base = css.split("@media (width >= 48rem)")[0];
  assert.match(base, /--challenge-ease-first: var\(--challenge-ease-first-mobile\)/);
  assert.match(base, /--challenge-ease-second: var\(--challenge-ease-second-mobile\)/);
  const desktop = css.split("@media (width >= 48rem)")[1].split("@supports")[0];
  assert.match(desktop, /--challenge-ease-first: var\(--challenge-ease-first-desktop\)/);
  assert.match(desktop, /--challenge-ease-second: var\(--challenge-ease-second-desktop\)/);
  assert.match(css, /\.tile\s*\{\s*animation-name: pull-back/);
  for (const rule of css.matchAll(/\.collage\s*\{([^}]+)\}/g)) assert.doesNotMatch(rule[1], /transform:|animation/);
});

test("Size, position and layer role each affect motion, without index-based staggering", () => {
  close(Object.values(motion.weights).reduce((a, b) => a + b), 1);
  const tile = tiles.find((tile) => tile.id === "70");
  const base = getChallengeTileMotion(tile);
  const wider = { ...tile, x: tile.x - tile.width / 2, y: tile.y - tile.height / 2, width: tile.width * 2, height: tile.height * 2 };
  const centered = { ...tile, x: camera.originX - tile.width / 2, y: camera.originY - tile.height / 2 };
  const foreground = { ...tile, depth: "near" };
  assert.ok(getChallengeTileMotion(wider).response > base.response);
  assert.ok(getChallengeTileMotion(centered).response < base.response);
  assert.ok(getChallengeTileMotion(foreground).response > base.response);
  assert.deepEqual(getChallengeTileMotion({ ...tile, id: "not-an-animation-index" }), base);
  for (const tile of tiles) {
    const data = tileMotion[tile.id];
    assert.ok(data.response >= 0 && data.response <= 1);
    assert.deepEqual(data, getChallengeTileMotion(tile));
  }
  // Actual composition: oversized right-edge tile leads, logo is the quietest;
  // equal-size map/lower tile still differ because their positions differ.
  const ordered = [...tiles].sort((a, b) => tileMotion[a.id].response - tileMotion[b.id].response);
  assert.equal(ordered[0].id, "62");
  assert.equal(ordered.at(-1).id, "65");
  assert.notEqual(tileMotion["63"].response, tileMotion["68"].response);
});

test("Stronger depth separates actual images in both segments, including formerly identical near layers", () => {
  for (const [progress, minimumGap] of [[0.25, 0.28], [0.675, 0.075]]) {
    const gap = scaleAt("62", "desktop", progress) - scaleAt("65", "desktop", progress);
    assert.ok(gap > minimumGap, `Insufficient depth separation at ${progress}`);
  }
  assert.ok(scaleAt("66", "desktop", 0.25) - scaleAt("65", "desktop", 0.25) > 0.06);
  // Actual center travel includes radius, not just abstract scale velocity.
  const distanceAt = (id, p) => tileMotion[id].radius * scaleAt(id, "desktop", p);
  const step = 0.0001;
  const speed = (id, p) => (distanceAt(id, p) - distanceAt(id, p + step)) / step;
  for (const p of [0.1, 0.6]) assert.ok(speed("65", p) > speed("62", p) * 3);
});

test("Text has stable reading windows and non-overlapping fade transitions", () => {
  const stories = ["state-one", "state-two", "state-three"].map((name) => stops(name, "opacity"));
  for (const [i, start, end] of [[0, 0.08, 0.20], [1, 0.44, 0.56], [2, 0.80, 1]]) {
    for (const p of [start, (start + end) / 2, end]) close(copyAt(stories[i], p), 1);
  }
  // 12% out + 12% in: 50% more fade distance on the unchanged short track.
  for (const [index, start, midpoint, end] of [[0, 0.20, 0.32, 0.44], [1, 0.56, 0.68, 0.80]]) {
    close(copyAt(stories[index], (start + midpoint) / 2), 0.5);
    close(copyAt(stories[index + 1], (midpoint + end) / 2), 0.5);
    close(end - start, 0.24);
  }
  for (let i = 0; i <= 1000; i++) {
    const opacities = stories.map((story) => copyAt(story, i / 1000));
    assert.ok(opacities.every((n) => n >= 0 && n <= 1));
    assert.ok(opacities.filter((n) => n > 0).length <= 1, "Never superimpose readable statements");
  }
});

test("Copy easing enters and leaves reading holds with zero velocity in either scroll direction", () => {
  close(copyBezier[0], 1 / 3, 1e-9);
  close(copyBezier[2], 2 / 3, 1e-9);
  assert.deepEqual([copyBezier[1], copyBezier[3]], [0, 1]);
  assert.match(css, /\.state\s*\{\s*animation-timing-function: var\(--challenge-copy-ease\)/);
  for (const name of ["state-one", "state-two", "state-three"]) {
    const story = stops(name, "opacity"), delta = 1e-7;
    for (const [p] of story) {
      close((copyAt(story, p) - copyAt(story, p - delta)) / delta, 0, 1e-4);
      close((copyAt(story, p + delta) - copyAt(story, p)) / delta, 0, 1e-4);
    }
    for (let i = 0; i <= 100; i++) close(copyAt(story, i / 100), copyAt(story, 1 - (100 - i) / 100));
  }
});

test("Text zoom follows its fade without overshoot, collisions or changes to reading size", () => {
  const hiddenScales = [...css.matchAll(/--challenge-copy-scale-hidden: ([\d.]+);/g)].map((match) => Number(match[1]));
  assert.deepEqual(hiddenScales, [0.96, 0.94]);
  const names = ["state-one", "state-two", "state-three"];
  for (const name of names) {
    const opacity = stops(name, "opacity"), scale = stops(name, "copy-scale");
    const block = css.split(`@keyframes ${name} {`)[1].split("\n}")[0];
    assert.equal((block.match(/transform: scale\((?:1|var\(--challenge-copy-scale-hidden\))\)/g) ?? []).length, name === "state-three" ? 2 : 3);
    for (const hidden of hiddenScales) for (let step = 0; step <= 1000; step++) {
      const p = step / 1000, visible = copyAt(opacity, p);
      const actual = hidden + (1 - hidden) * copyAt(scale, p);
      close(actual, hidden + (1 - hidden) * visible);
      assert.ok(actual >= hidden && actual <= 1);
      if (visible === 1) close(actual, 1);
      close(actual, hidden + (1 - hidden) * copyAt(scale, 1 - (1000 - step) / 1000));
    }
  }
  for (const boundary of [0.32, 0.68]) {
    for (const delta of [-0.0001, 0, 0.0001]) {
      assert.ok(names.filter((name) => copyAt(stops(name, "opacity"), boundary + delta) > 0).length <= 1);
    }
  }
  const base = css.split("@supports")[0];
  assert.match(base, /\.state\s*\{[^}]*transform: none;[^}]*transform-origin: center/);
});

test("Text only softens during entry/exit and stays sharp throughout reading windows", () => {
  assert.match(css, /--challenge-copy-blur: 6px/);
  assert.match(css, /@media \(width >= 48rem\)[\s\S]*--challenge-copy-blur: 8px/);
  for (const name of ["state-one", "state-two", "state-three"]) {
    const opacity = stops(name, "opacity"), blur = stops(name, "blur");
    const block = css.split(`@keyframes ${name} {`)[1].split("\n}")[0];
    assert.equal((block.match(/filter: blur\((?:0px|var\(--challenge-copy-blur\))\)/g) ?? []).length, opacity.length === 4 ? 2 : 3);
    for (let i = 0; i <= 1000; i++) {
      const p = i / 1000;
      close(copyAt(blur, p), 1 - copyAt(opacity, p));
    }
  }
  // No section-wide or artwork blur, and no animated layout properties.
  for (const selector of ["track", "stage", "visual", "artwork", "collage", "layer", "tile"]) {
    for (const rule of css.matchAll(new RegExp(`\\.${selector}\\s*\\{([^}]+)\\}`, "g"))) assert.doesNotMatch(rule[1], /filter:/);
  }
});

test("Markers draw over 10% of travel then hold their full shape through the shared text exit", () => {
  const timings = [
    ["one", "state-1", 0.08, 0.09, 0.19, 0.20],
    ["two", "state-2", 0.44, 0.45, 0.55, 0.56],
    ["three", "state-3", 0.80, 0.81, 0.91, 1],
  ];
  for (const [name, state, sharp, start, end, exit] of timings) {
    assert.ok(start > sharp && end < exit);
    close(end - start, 0.1);
    const block = css.split(`@keyframes underline-${name} {`)[1].split("\n}")[0];
    assert.doesNotMatch(block, /transform:|opacity:|filter:|width:|height:/);
    assert.match(css, new RegExp(`\\.state\\[data-state="${state}"\\] \\.underline \\{ animation-name: underline-${name}; \\}`));
    if (name === "one") {
      // The single stroke keeps its left→right wipe.
      const clip = stops(`underline-${name}`, "clip");
      assert.deepEqual(clip, [[0, 100], [start, 100], [end, 0], [1, 0]]);
      for (const p of [exit, (exit + 1) / 2, 1]) close(valueAt(clip, p), 0);
    } else {
      const frames = [...block.matchAll(/([\d.%,\s]+)\{ clip-path: var\(--marker-([a-z]+)\); \}/g)]
        .flatMap((match) => match[1].split(",").map((p) => [Number.parseFloat(p) / 100, match[2]]));
      const outbound = name === "two" ? 0.51 : 0.87;
      const turn = name === "two" ? 0.52 : 0.88;
      assert.deepEqual(frames, [[0, "hidden"], [start, "hidden"], [outbound, "outbound"], [turn, "turn"], [end, "complete"], [1, "complete"]]);
    }
  }
  assert.match(css, /--challenge-marker-ease: linear;/);
  assert.match(css, /\.underline\s*\{\s*animation-timing-function: var\(--challenge-marker-ease\)/);
  assert.match(css, /\.state,\s*\.underline,\s*\.layer,\s*\.tile\s*\{[^}]*animation-timeline: --challenge-today/);
});

test("Two-stroke reveals traverse upper left→right before lower right→left without hiding finished ink", () => {
  const polygon = (name, left, right) => {
    const value = css.match(new RegExp(`--marker-${name}: polygon\\(([^;]+)\\);`))[1]
      .replaceAll("var(--marker-divider-left)", `${left}%`)
      .replaceAll("var(--marker-divider-right)", `${right}%`);
    return value.split(",").map((point) => point.trim().split(/\s+/).map(parseFloat));
  };
  const contains = (points, x, y) => {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i], [xj, yj] = points[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  for (const state of ["state-2", "state-3"]) {
    const rule = css.match(new RegExp(`\\.state\\[data-state="${state}"\\] \\.underline \\{([^}]+)`))[1];
    const left = Number(rule.match(/--marker-divider-left: (\d+)%/)[1]);
    const right = Number(rule.match(/--marker-divider-right: (\d+)%/)[1]);
    const frames = ["hidden", "outbound", "turn", "complete"].map((name) => polygon(name, left, right));
    frames.forEach((points) => assert.equal(points.length, 6));
    const covered = new Set();
    for (let segment = 0; segment < 3; segment++) for (let step = 0; step <= 20; step++) {
      const t = step / 20;
      const points = frames[segment].map((point, i) => point.map((v, j) => v + (frames[segment + 1][i][j] - v) * t));
      for (let x = 0.5; x < 100; x += 2) for (let y = 0.5; y < 100; y += 2) {
        const key = `${x}/${y}`, visible = contains(points, x, y);
        const divider = left + (right - left) * x / 100;
        if (covered.has(key)) assert.ok(visible, "Previously drawn ink must stay visible");
        if (visible) covered.add(key);
        if (segment === 0) assert.equal(visible, x < t * 100 && y < divider, "Upper stroke moves left→right only");
        if (segment === 2) assert.equal(visible, y < divider || x > (1 - t) * 100, "Lower stroke returns right→left");
      }
    }
    assert.equal(covered.size, 2500, "Full original artwork is restored, without a residual crop");
  }
});

test("Cover-fit frame preserves proportions and sticky distance at every breakpoint", () => {
  assert.match(css, /width: max\(100cqw, calc\(100cqh \* 1440 \/ 928\)\)/);
  assert.match(css, /--challenge-pin-top: 5\.75rem/);
  assert.match(css, /@media \(width >= 48rem\)[\s\S]*--challenge-pin-top: 5\.25rem/);
  assert.match(css.split("@media (width >= 48rem)")[0], /--challenge-scroll-distance: 210svh/);
  assert.match(css.split("@media (width >= 48rem)")[1], /--challenge-scroll-distance: 280svh/);
  assert.match(css, /\.track::after\s*\{[^}]*height: var\(--challenge-scroll-distance\)/);
  assert.match(css, /animation-range: exit-crossing 0px exit-crossing var\(--challenge-scroll-distance\)/);
  const widths = [375, 390, 393, 414, 430, 767, 768, 769, 1023, 1024, 1279, 1280, 1440];
  for (const width of widths) for (const viewportHeight of [480, 600, 844, 1012]) {
    const pin = width < 768 ? 92 : 84;
    const height = viewportHeight - pin;
    const ratio = Math.max(width / camera.width, height / camera.height);
    const frameWidth = camera.width * ratio, frameHeight = camera.height * ratio;
    assert.ok(frameWidth >= width - 1e-8 && frameHeight >= height - 1e-8);
    close(frameWidth / frameHeight, 1440 / 928);
    const start = 2000 - pin, distance = viewportHeight * (width < 768 ? 2.1 : 2.8);
    const previousDistance = viewportHeight * (width < 768 ? 4.8 : 6.4);
    for (const interval of [0.10, 0.08]) {
      close(distance * interval, 0.4375 * previousDistance * interval);
    }
    // Stage + following spacer = containing block; pinning ends at start + distance.
    const trackBottom = 2000 + height + distance;
    close(trackBottom - height - pin, start + distance);
    for (const progress of [0, 0.25, 0.5, 0.7, 0.85, 1]) {
      const scrollY = start + distance * progress;
      close((scrollY - start) / distance, progress);
    }
  }
});

test("Only supported, motion-safe, tall viewports pin; default shows all content", () => {
  assert.match(css, /@supports \(animation-timeline: view\(\)\) and \(animation-range: exit-crossing 0px exit-crossing 100px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) and \(height >= 30rem\)/);
  const base = css.split("@supports")[0];
  assert.doesNotMatch(base, /position: sticky|animation-name:|grid-row: 1/);
  assert.match(base, /\.state\s*\{\s*opacity: 1/);
  assert.match(base, /\.artwork\s*\{\s*display: none/);
  assert.match(base, /row-gap: var\(--space-section-standard\)/);
  assert.match(base, /\.state\s*\{[^}]*filter: none/);
  assert.match(base, /\.underline\s*\{\s*clip-path: inset\(0 0 0 0\)/);
  assert.doesNotMatch(css, /100dvh|will-change|position: fixed|scroll-snap|transition:|visibility:/);
  assert.doesNotMatch(source, /overflow-hidden|h-screen/);
  for (const file of ["src/app/page.tsx", "src/app/homepage/page.tsx"]) {
    assert.match(read(file), /<KeyMetrics \/>\s*<ChallengeToday \/>\s*<Features \/>/);
    assert.match(read(file), /<main>/);
  }
});

// Render actual section/artwork modules with Next Image and layout shells
// stubbed only to inspect server semantics (no browser or layout engine).
const stubs = {
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/image": { __esModule: true, default: ({ fill, ...props }) => createElement("img", { loading: "lazy", ...props, "data-fill": fill || undefined }) },
  "@/components/layout/grid": { Container: ({ children }) => createElement("div", null, children), Grid: ({ children, ...props }) => createElement("div", props, children) },
  "@/components/visuals/product-dashboard/scaled-canvas": { ScaledCanvas: ({ children, width, height }) => createElement("div", { "data-canvas": `${width}/${height}` }, children) },
  "./challenge-data": { challengeCamera: camera, challengeTiles: tiles, challengeStates: states, challengeTileMotion: tileMotion },
  "./challenge-today.module.css": { __esModule: true, default: Object.fromEntries(["track", "stage", "visual", "contentGrid", "state", "underline", "artwork", "artworkFrame", "collage", "layer", "tile"].map((name) => [name, name])) },
};
function compile(code) {
  const exports = {};
  runInNewContext(ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, {
    exports,
    require(name) { assert.ok(name in stubs, name); return stubs[name]; },
  });
  return exports;
}
stubs["./challenge-artwork"] = compile(artwork);
const { ChallengeToday } = compile(source);

test("Server markup includes each statement once, one H2, stable anchors and one collage", () => {
  const html = renderToStaticMarkup(createElement(ChallengeToday));
  for (const slot of ["challenge-today", "challenge-stage", "challenge-visual", "challenge-artwork", "challenge-collage"]) assert.equal(html.split(`data-slot="${slot}"`).length - 1, 1);
  assert.equal(html.split('id="challenge-today-heading"').length - 1, 1);
  assert.equal(html.split("<h2 ").length - 1, 1);
  assert.equal(html.split("<p ").length - 1, 2);
  assert.equal(html.split('data-slot="challenge-state"').length - 1, 3);
  assert.equal(html.split('data-slot="challenge-underline"').length - 1, 3);
  assert.equal((html.match(/data-slot="challenge-underline" aria-hidden="true"/g) ?? []).length, 3);
  assert.equal(html.split('data-slot="challenge-tile-').length - 1, 9);
  for (const state of states) {
    for (const text of [state.firstLine, state.emphasis]) assert.equal(html.split(text).length - 1, 1);
    assert.ok(html.includes(state.underline.src));
  }
  assert.match(html, /data-state="state-1"[\s\S]*data-state="state-2"[\s\S]*data-state="state-3"/);
  assert.doesNotMatch(html, /aria-live|tabindex|loading="eager"|rel="preload"/);
  assert.doesNotMatch(source + artwork, /use client|useState|useEffect|requestAnimationFrame|addEventListener|ResizeObserver|IntersectionObserver|onScroll|aria-live|inert/);
  assert.match(source, /aria-labelledby="challenge-today-heading"/);
  // A shared row alone does not overlap auto-placed columns: below xl each
  // statement must explicitly start at line 1, not create implicit columns.
  assert.match(source, /col-span-12 col-start-1 text-center xl:col-start-3 xl:col-end-11/);
  assert.match(artwork, /mix-blend-hard-light/);
  assert.match(artwork, /tile.underlay/);
});

test("Each stable tile anchor zooms inside a separate travel layer, with the small detail behind the machinery", () => {
  const html = renderToStaticMarkup(createElement(ChallengeToday));
  const nodes = [...html.matchAll(/<div data-slot="challenge-tile-(\d+)"[^>]+>/g)];
  const layers = [...html.matchAll(/<div data-slot="challenge-layer-(\d+)"[^>]+>/g)];
  const order = ["62", "63", "68", "66", "69", "64", "70", "67", "65"];
  assert.deepEqual(nodes.map((m) => m[1]), order);
  assert.deepEqual(layers.map((m) => m[1]), order);
  assert.ok(order.indexOf("70") < order.indexOf("67"));
  const expectedDepth = { 62: "far", 63: "middle", 68: "middle", 66: "near", 69: "near", 64: "near", 67: "near", 70: "far", 65: "near" };
  for (const [index, [node, id]] of nodes.entries()) {
    const tile = tiles[index];
    assert.equal(tile.depth, expectedDepth[id]);
    assert.ok(node.includes(`data-depth="${tile.depth}"`));
    assert.ok(node.includes('class="relative h-full w-full overflow-hidden tile '));
    const layer = layers[index][0];
    const centerX = tile.x + tile.width / 2 - camera.originX;
    const centerY = tile.y + tile.height / 2 - camera.originY;
    assert.ok(layer.includes(`--challenge-travel-start:${centerX * (camera.startScale - 1)}px, ${centerY * (camera.startScale - 1)}px`));
    assert.ok(layer.includes(`--challenge-travel-middle:${centerX * (camera.middleScale - 1)}px, ${centerY * (camera.middleScale - 1)}px`));
    for (const viewport of viewports) for (const segment of ["first", "second"]) {
      assert.ok(layer.includes(`--challenge-ease-${segment}-${viewport}:${tileMotion[tile.id][viewport][segment]}`));
      assert.ok(node.includes(`--challenge-zoom-${segment}-${viewport}:${tileMotion[tile.id].zoom[viewport][segment]}`));
      assert.ok(node.includes(`--challenge-zoom-middle-${viewport}:${tileMotion[tile.id].zoom[viewport].middleScale}`));
    }
  }
  assert.doesNotMatch(html.match(/<div data-slot="challenge-collage"[^>]+>/)[0], /transform-origin|transform:/);
  assert.equal(html.split('data-fill="true"').length - 1, 14);
  assert.match(html, /data-slot="challenge-tile-70"[\s\S]*riso-67.png[\s\S]*riso-surveyor.png/);
  assert.doesNotMatch(css, /perspective|rotate[XYZ]?\(|z-index:/);
  assert.match(css, /\.tile\s*\{[^}]*transform-origin: center/);
  assert.match(css, /\.layer\s*\{\s*animation-name: travel-back/);
  assert.match(css, /@keyframes travel-back[\s\S]*translate\(var\(--challenge-travel-middle\)\)/);
  for (const viewport of viewports) {
    assert.match(css, new RegExp(`--challenge-scale-middle: var\\(--challenge-zoom-middle-${viewport}\\)`));
    assert.match(css, new RegExp(`--challenge-ease-second: var\\(--challenge-zoom-second-${viewport}\\)`));
  }
});

test("Original assets and SVG proportions exist; image delivery accounts for camera scale", async () => {
  const assetSources = [...new Set(tiles.flatMap((t) => [t.src, t.underlay].filter(Boolean)))];
  for (const src of assetSources) {
    const bytes = readFileSync(new URL(`../public${src}`, import.meta.url));
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.format, "png");
    assert.ok(metadata.width > 0 && metadata.height > 0);
  }
  for (const state of states) {
    const svg = read(`public${state.underline.src}`);
    assert.match(svg, new RegExp(`viewBox="0 0 ${state.underline.width} ${state.underline.height}"`));
  }
  assert.match(artwork, /tile.width \* camera.startScale/);
  assert.match(artwork, /fill sizes=\{sizes\}/);
  assert.doesNotMatch(artwork.replace(/\/\/[^\n]*/g, ""), /unoptimized|preload|quality=|loading="eager"/);
  assert.match(source, /src="\/assets\/images\/features\/card-texture.png"/);
});
