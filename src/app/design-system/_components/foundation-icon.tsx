type FoundationIconProps = {
  src: string;
  className?: string;
};

export function FoundationIcon({ src, className = "size-3.5" }: FoundationIconProps) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 14 14" fill="none" className={`shrink-0 ${className}`}>
      <use href={`${src}#Frame`} />
    </svg>
  );
}
