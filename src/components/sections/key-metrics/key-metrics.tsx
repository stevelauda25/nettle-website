import { Container, Grid } from "@/components/layout/grid";
import { MetricBar, type MetricBarVariant } from "./metric-bar";

type Metric = {
  value: string;
  label: string;
  bar: MetricBarVariant;
};

const metrics: Metric[] = [
  { value: "5x", label: "Faster surveys", bar: "surveys" },
  { value: "Same-day", label: "Decision results", bar: "decisions" },
  { value: "360°", label: "Account visibility", bar: "visibility" },
];

// Figma: Key Metrics (392:6911). Heading and a row of three equal metric cards
// on columns 2–11 (148px inset at 1440, same as the Video Explainer). The cards
// split that 10-column span into thirds with the grid gutter, as drawn in Figma.
export function KeyMetrics() {
  return (
    <section aria-labelledby="key-metrics-heading" className="bg-white pt-(--space-section-media) pb-(--space-section-major)">
      <Container>
        <Grid>
          <div className="col-span-12 flex flex-col gap-(--space-major-content-gap) lg:col-start-2 lg:col-end-12">
            <h2 id="key-metrics-heading" className="text-heading-h3 text-black">
              Faster risk decisions.
              <br />
              Zero blind spots.
            </h2>

            <ul className="grid grid-cols-1 gap-(--grid-gutter) lg:grid-cols-3">
              {metrics.map((metric) => (
                <li key={metric.value} data-slot="metric-card" className="border-l border-warm-gray-600">
                  <div className="flex flex-col gap-(--space-tight-gap) px-(--space-card-padding) pt-(--space-card-leading) pb-(--space-card-padding)">
                    <p data-slot="metric-value" className="text-heading-h4 whitespace-nowrap text-black">
                      {metric.value}
                    </p>
                    <p data-slot="metric-label" className="text-heading-h6 text-warm-gray-950">
                      {metric.label}
                    </p>
                  </div>
                  <MetricBar variant={metric.bar} />
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Container>
    </section>
  );
}
