import type { CSSProperties } from "react";
import Image from "next/image";
import { ScaledCanvas } from "@/components/visuals/product-dashboard/scaled-canvas";
import { challengeCamera as camera, challengeTileMotion, challengeTiles } from "./challenge-data";
import styles from "./challenge-today.module.css";

export function ChallengeArtwork() {
  return (
    <div data-slot="challenge-artwork" className={styles.artwork} aria-hidden="true">
      <div className={styles.artworkFrame}>
        <ScaledCanvas width={camera.width} height={camera.height} label="Archival loss control collage" className="rounded-none">
          <div
            data-slot="challenge-collage"
            className={styles.collage}
            style={{
              "--challenge-scale-start": camera.startScale,
              "--challenge-scale-end": camera.endScale,
            } as CSSProperties}
          >
            {challengeTiles.map((tile) => {
              const easing = challengeTileMotion[tile.id];
              const centerX = tile.x + tile.width / 2 - camera.originX;
              const centerY = tile.y + tile.height / 2 - camera.originY;
              // Reserve enough source detail for the largest camera scale.
              // Cover-fit frame = max(viewport width, stage height × 1440/928).
              // svh slightly overestimates stage height (header excluded), safely
              // avoiding undersized sources without preloading below-fold images.
              const largestWidth = tile.width * camera.startScale;
              const sizes = `max(${(largestWidth / camera.width * 100).toFixed(4)}vw, ${(largestWidth / camera.height * 100).toFixed(4)}svh)`;
              return (
                <div
                  key={tile.id}
                  data-slot={`challenge-layer-${tile.id}`}
                  className={`absolute ${styles.layer}`}
                  style={{
                    left: tile.x, top: tile.y, width: tile.width, height: tile.height,
                    "--challenge-travel-start": `${centerX * (camera.startScale - 1)}px, ${centerY * (camera.startScale - 1)}px`,
                    "--challenge-travel-middle": `${centerX * (camera.middleScale - 1)}px, ${centerY * (camera.middleScale - 1)}px`,
                    "--challenge-ease-first-desktop": easing.desktop.first,
                    "--challenge-ease-second-desktop": easing.desktop.second,
                    "--challenge-ease-first-mobile": easing.mobile.first,
                    "--challenge-ease-second-mobile": easing.mobile.second,
                  } as CSSProperties}
                >
                  <div
                    data-slot={`challenge-tile-${tile.id}`}
                    data-depth={tile.depth}
                    className={`relative h-full w-full overflow-hidden ${styles.tile} ${tile.treatment === "logo" ? "bg-warm-gray-400" : ""}`}
                    style={{
                      "--challenge-zoom-middle-desktop": easing.zoom.desktop.middleScale,
                      "--challenge-zoom-middle-mobile": easing.zoom.mobile.middleScale,
                      "--challenge-zoom-first-desktop": easing.zoom.desktop.first,
                      "--challenge-zoom-second-desktop": easing.zoom.desktop.second,
                      "--challenge-zoom-first-mobile": easing.zoom.mobile.first,
                      "--challenge-zoom-second-mobile": easing.zoom.mobile.second,
                      // Unbound Figma fill behind Rectangle 66; not a shared token.
                      backgroundColor: tile.treatment === "building" ? "#d9d9d9" : undefined,
                    } as CSSProperties}
                  >
                    {tile.underlay ? <Image src={tile.underlay} alt="" fill sizes={sizes} className="object-cover" /> : null}
                    <Image src={tile.src} alt="" fill sizes={sizes} className={`object-cover ${tile.treatment === "logo" ? "mix-blend-hard-light" : ""}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </ScaledCanvas>
      </div>
    </div>
  );
}
