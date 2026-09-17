import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { TestimonialCarousel } from "./testimonial-carousel";
import { AllianzArtwork } from "./visuals/allianz-artwork";
import { AllianzMobileArtwork } from "./visuals/allianz-mobile-artwork";
import { BrotherhoodArtwork } from "./visuals/brotherhood-artwork";
import { BrotherhoodMobileArtwork } from "./visuals/brotherhood-mobile-artwork";
import { AllianzLogo, BrotherhoodLogo } from "./visuals/company-logos";
import styles from "./testimonial.module.css";

type TestimonialCardProps = {
  company: string;
  logo: ReactNode;
  artwork: ReactNode;
  mobileArtwork: ReactNode;
  children: ReactNode;
  className: string;
};

function TestimonialCard({ company, logo, artwork, mobileArtwork, children, className }: TestimonialCardProps) {
  return (
    <li className={`${styles.card} relative isolate overflow-hidden rounded-md ${className}`} data-slot="testimonial-card">
      <Image src="/assets/images/features/card-texture.png" alt="" fill sizes="(min-width: 1440px) 1144px, 100vw" className="pointer-events-none -z-10 object-cover opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 hidden select-none md:block lg:top-0" aria-hidden="true">{artwork}</div>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 select-none md:hidden" aria-hidden="true">{mobileArtwork}</div>
      <figure aria-label={`${company} testimonial`} className={`${styles.figure} flex h-full min-h-[516px] flex-col gap-(--space-content-gap) p-(--space-card-padding-spacious)`}>
        <figcaption className="flex justify-end">{logo}</figcaption>
        {/* Keep tablet's artwork row; mobile reserves its own shorter composition. */}
        <div aria-hidden="true" className={`${styles.artworkSpace} aspect-[1144/516] shrink-0 lg:hidden`} />
        <div className={`${styles.content} mt-auto flex flex-col gap-(--space-content-gap) lg:flex-row lg:items-end lg:justify-between`}>
          <blockquote className={`text-heading-h5 text-white ${styles.quote}`}>{children}</blockquote>
          {/* Figma supplies CTA copy, but no case-study URL. */}
          <Link href="#" aria-label={`Read ${company} case study`} className="text-body-small-medium relative hidden shrink-0 self-start whitespace-nowrap text-white underline before:absolute before:-inset-y-3 before:inset-x-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:block lg:self-end">Read case study →</Link>
        </div>
      </figure>
    </li>
  );
}

// Approved Figma 415:4223, 1440 × 906: two 1144 × 516 cards, beginning on
// column 2. Mobile cards: 440:4548 (340 × 406); no person attribution supplied.
export function Testimonial() {
  return (
    <section aria-labelledby="testimonial-heading" data-slot="testimonial" className="overflow-hidden bg-white py-(--space-section-prominent)">
      <TestimonialCarousel>
        <TestimonialCard company="Allianz" logo={<AllianzLogo />} artwork={<AllianzArtwork />} mobileArtwork={<AllianzMobileArtwork />} className={`bg-black ${styles.allianz}`}>
          {`"Nettle is genuinely `}<span className={`text-brand-50 ${styles.emphasis}`} style={{ backgroundImage: "url(/assets/icons/testimonial/allianz-underline.svg)" }}>the future of risk engineering</span>{`. This is the future for the whole sector"`}
        </TestimonialCard>
        <TestimonialCard company="Brotherhood Mutual" logo={<BrotherhoodLogo />} artwork={<BrotherhoodArtwork />} mobileArtwork={<BrotherhoodMobileArtwork />} className={`bg-brand-600 ${styles.brotherhood}`}>
          {`"Using Nettle `}<span className={`text-brand-50 ${styles.emphasis}`} style={{ backgroundImage: "url(/assets/icons/testimonial/brotherhood-underline.svg)" }}>changes us</span>{` to the point where we're going to look back and say 'why did we put up with working that way for so long?'"`}
        </TestimonialCard>
      </TestimonialCarousel>
    </section>
  );
}
