import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Grid } from "@/components/layout/grid";

type NavItem = { label: string; href: string; hasMenu: boolean };

// "Resources" is hidden in Figma and intentionally omitted.
const navItems: NavItem[] = [
  { label: "Product", href: "#", hasMenu: true },
  { label: "Solutions", href: "#", hasMenu: true },
  { label: "Customers", href: "#", hasMenu: false },
  { label: "Security", href: "#", hasMenu: false },
  { label: "Company", href: "#", hasMenu: true },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="flex items-center justify-center gap-x-2 bg-warm-gray-950 px-[var(--grid-margin)] text-center text-body-small-regular text-white md:px-2.5 md:py-1.5">
        <p className="min-w-0 truncate">Nettle raises $4.8M Seed to build the AI workspace for loss control.</p>
        <Link href="#" className="flex min-h-11 shrink-0 items-center whitespace-nowrap underline md:min-h-0">
          Read Announcement →
        </Link>
      </div>

      <div className="bg-white py-2 shadow-[inset_0_-0.5px_0_0_var(--color-black)] shadow-black/20">
        <Container>
          <Grid className="items-center">
            <Link href="/" aria-label="Nettle home" className="col-span-6 lg:col-span-3">
              <Image src="/assets/logos/nettle.svg" alt="" width={143} height={17} />
            </Link>

            <nav aria-label="Primary" className="hidden lg:col-start-4 lg:col-end-10 lg:block">
              <ul className="flex items-center justify-center">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3 py-1.5 text-body-small-regular text-warm-gray-900"
                    >
                      {item.label}
                      {item.hasMenu && (
                        <Image src="/assets/icons/navigation/chevron-down.svg" alt="" width={16} height={16} />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-6 flex justify-end lg:col-start-10 lg:col-end-13">
              <Button href="#">Request a Demo</Button>
            </div>
          </Grid>
        </Container>
      </div>
    </header>
  );
}
