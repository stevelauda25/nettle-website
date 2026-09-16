type DocsHeaderProps = {
  title: string;
  breadcrumb?: {
    parent: string;
    current: string;
  };
};

export function DocsHeader({ title, breadcrumb }: DocsHeaderProps) {
  return (
    <header className="col-start-2 row-start-1 flex h-16 items-center justify-between px-5 py-4 shadow-[inset_0_-1px_0_var(--color-border-default)]">
      {breadcrumb ? (
        <div className="flex items-center gap-1.5 text-sm leading-5 font-normal tracking-[0]">
          <span className="text-text-secondary">{breadcrumb.parent}</span>
          <span className="text-text-secondary">/</span>
          <span className="text-text-primary">{breadcrumb.current}</span>
        </div>
      ) : (
        <p className="text-sm leading-5 font-normal tracking-[0] text-text-primary">{title}</p>
      )}
    </header>
  );
}
