export type BusinessLine = {
  id: string;
  name: string;
  description: string;
  visual: "commercial-property" | "workers-compensation" | "liability" | "construction" | "commercial-auto" | "high-net-worth" | "energy-marine";
};

export const businessLines: BusinessLine[] = [
  {
    id: "commercial-property",
    name: "Commercial Property",
    description: "Improve property risk insight through better inspections and structured evidence",
    visual: "commercial-property",
  },
  {
    id: "workers-compensation",
    name: "Worker’s Compensation",
    description: "Identify workplace safety risk through safer inspections and structured evidence",
    visual: "workers-compensation",
  },
  {
    id: "liability",
    name: "Liability",
    description: "Clarify liability risk insight through clearer exposures and structured evidence",
    visual: "liability",
  },
  {
    id: "construction-builders-risk",
    name: "Construction & Builder’s Risk",
    description: "Strengthen construction risk through project inspections and structured evidence",
    visual: "construction",
  },
  {
    id: "commercial-auto-fleet",
    name: "Commercial Auto & Fleet",
    description: "Capture commercial fleet risk through better inspections and structured evidence",
    visual: "commercial-auto",
  },
  {
    id: "high-net-worth-home",
    name: "High Net Worth Home",
    description: "Track high-value property risk through field inspections and structured evidence",
    visual: "high-net-worth",
  },
  {
    id: "energy-marine-specialty",
    name: "Energy, Marine & Specialty",
    description: "Surface energy and marine risk through complex exposures and structured evidence",
    visual: "energy-marine",
  },
];
