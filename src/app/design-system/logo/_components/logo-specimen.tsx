import { logoPaths } from "./logo-paths";
import styles from "./logo-specimen.module.css";

type LogoSpecimenProps = {
  dark: boolean;
  coloured: boolean;
  transparent: boolean;
};

/** Documentation-only colour application; never substitutes for the header master. */
export function LogoSpecimen({ dark, coloured, transparent }: LogoSpecimenProps) {
  const wordmark = dark ? "var(--color-warm-gray-100)" : "var(--color-cold-gray-500)";
  const symbol = coloured ? "var(--color-brand-500)" : wordmark;

  return (
    <div className={`${styles.surface} ${dark ? styles.dark : styles.light} ${transparent ? styles.transparent : ""}`}>
      {/* The paths occupy x=0…79, y=0…17. Tight specimen framing removes only
          unused export canvas; it never changes path geometry or lockup spacing. */}
      <svg viewBox="0 0 79 17" width={284} height={61.114} className="block h-auto w-full max-w-72" role="img"
        aria-label={`Nettle: ${coloured ? "orange" : "black"} symbol and ${dark ? "cream" : "black"} wordmark on ${dark ? "dark" : "light"}${transparent ? " transparency checkerboard" : " background"}`}>
        {logoPaths.map((path, index) => (
          <path key={path.d} d={path.d} fillRule={"fillRule" in path ? path.fillRule : undefined}
            clipRule={"fillRule" in path ? path.fillRule : undefined} fill={index === 0 ? symbol : wordmark} />
        ))}
      </svg>
    </div>
  );
}
