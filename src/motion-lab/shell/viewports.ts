/**
 * Approved viewport presets. Desktop and Mobile are the Figma frames and the
 * ends of Nettle's fluid type and spacing range; Tablet is the 768px breakpoint
 * where mobile artwork swaps out. Fluid is the real pane, freely resizable.
 */
export const VIEWPORTS = [
  { id: "desktop", label: "Desktop", width: 1440, height: 900 },
  { id: "tablet", label: "Tablet", width: 768, height: 1024 },
  { id: "mobile", label: "Mobile", width: 390, height: 844 },
  { id: "fluid", label: "Fluid", width: null, height: null },
] as const;

export type ViewportId = (typeof VIEWPORTS)[number]["id"];
export const VIEWPORT_IDS = VIEWPORTS.map((viewport) => viewport.id) as readonly ViewportId[];

export function viewportById(id: ViewportId) {
  return VIEWPORTS.find((viewport) => viewport.id === id) ?? VIEWPORTS[0];
}
