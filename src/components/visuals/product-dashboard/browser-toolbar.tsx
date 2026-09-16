import Image from "next/image";
import { browserIcons } from "./data";

// Figma: Core / Safari (Big Sur) / Toolbar / Light (388:5798), 53px tall.
export function BrowserToolbar({ url }: { url: string }) {
  return (
    <div
      data-slot="browser-toolbar"
      className="absolute inset-x-0 top-0 h-[53px] bg-white shadow-[0_0.5px_0_0_var(--color-black)] shadow-black/15"
    >
      <Image src={browserIcons.trafficLights} alt="" width={52} height={12} className="absolute top-5 left-[21px]" />
      <Image src={browserIcons.sidebar} alt="" width={33} height={28} className="absolute top-3 left-[92px]" />
      <div className="absolute top-3 left-[134px] flex">
        <Image src={browserIcons.back} alt="" width={33} height={28} />
        <Image src={browserIcons.forward} alt="" width={33} height={28} />
      </div>

      <div className="absolute inset-x-[26.56%] top-3 h-7">
        <Image src={browserIcons.shield} alt="" width={33} height={28} className="absolute top-0 left-0" />
        <div data-slot="browser-address" className="absolute inset-x-[42px] top-0 h-7 rounded-md bg-black/5">
          <div className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center gap-1.5">
            <span className="relative block h-[11.432px] w-[7.828px]">
              <Image src={browserIcons.lock} alt="" fill />
            </span>
            <span className="font-[system-ui] text-[13px] tracking-[-0.004em] whitespace-nowrap text-black/70">{url}</span>
          </div>
          <span className="absolute top-1/2 right-[6.33px] block h-[12.615px] w-[10.354px] -translate-y-1/2">
            <Image src={browserIcons.reload} alt="" fill />
          </span>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        {browserIcons.trailing.map((src) => (
          <Image key={src} src={src} alt="" width={33} height={28} />
        ))}
      </div>
    </div>
  );
}
