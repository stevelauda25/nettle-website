export type ColorSwatchValue = {
  name: string;
  value: string;
  fill?: string;
};

export function ColorSwatch({ name, value, fill = value }: ColorSwatchValue) {
  return (
    <div className="relative flex min-h-[86px] w-[138.5px] flex-col overflow-hidden rounded-card bg-background-primary shadow-card">
      <div
        aria-hidden="true"
        className="h-8 shrink-0 rounded-t-navigation border-b-[0.5px] border-border-default"
        style={{ backgroundColor: fill }}
      />
      <div className="flex min-h-[54px] flex-1 flex-col justify-center gap-0.5 rounded-b-navigation bg-background-primary px-3 py-2 text-xs leading-[18px] font-normal tracking-[0]">
        <p className="text-text-primary">{name}</p>
        <p className="text-text-secondary">{value}</p>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-[0.5px] border-border-default" />
    </div>
  );
}
