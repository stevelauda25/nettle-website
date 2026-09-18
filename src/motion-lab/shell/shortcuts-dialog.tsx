"use client";

import { SHORTCUT_GROUPS } from "./shortcuts";
import styles from "./lab.module.css";

/** Compact keyboard reference. Secondary by design: opened with "?" or the small button. */
export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className={styles.helpBackdrop} onClick={onClose}>
      <section
        className={styles.help}
        role="dialog"
        aria-modal="true"
        aria-labelledby="motion-lab-shortcuts-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.helpHead}>
          <h2 id="motion-lab-shortcuts-title">Keyboard shortcuts</h2>
          <button type="button" className={styles.segment} onClick={onClose} aria-label="Close shortcuts">
            Close
          </button>
        </div>
        <div className={styles.helpGroups}>
          {SHORTCUT_GROUPS.map((group) => (
            <section key={group.title} className={styles.helpGroup} data-future={group.future ? "" : undefined}>
              <h3>{group.title}</h3>
              <dl>
                {group.items.map((item) => (
                  <div key={item.label}>
                    <dt>
                      {item.keys.map((key) => (
                        <kbd key={key}>{key}</kbd>
                      ))}
                    </dt>
                    <dd>{item.label}</dd>
                  </div>
                ))}
              </dl>
              {group.future && <p>Reserved for the tuning system&rsquo;s own history. Not bound yet.</p>}
            </section>
          ))}
        </div>
        <p className={styles.helpNote}>Single keys work without Cmd, Ctrl or Alt, and pause while you type in a field.</p>
      </section>
    </div>
  );
}
