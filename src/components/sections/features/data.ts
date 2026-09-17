export type FeatureVisual = "prioritisation" | "reporting" | "coverage" | "prevention";

export type Feature = {
  title: string;
  description: string;
  visual: FeatureVisual;
  visualHeight: 346 | 347 | 348;
};

export const features: Feature[] = [
  {
    title: "Prioritise the right risks first",
    description:
      "Use portfolio data and prior surveys to identify which risks need a site visit before travel is scheduled.",
    visual: "prioritisation",
    visualHeight: 348,
  },
  {
    title: "Turn fieldwork into reports, faster",
    description: "Capture field evidence and use AI to turn findings into structured, same-day reports.",
    visual: "reporting",
    visualHeight: 346,
  },
  {
    title: "Get eyes on more risks",
    description:
      "Extend inspection coverage through guided self-surveys completed by clients and agency partners.",
    visual: "coverage",
    visualHeight: 346,
  },
  {
    title: "Keep prevention moving after the survey",
    description:
      "Track recommendations, remediation progress, and prevention activity across every account after the survey.",
    visual: "prevention",
    visualHeight: 347,
  },
];
