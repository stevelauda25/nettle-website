"use client";

import { useEffect, useRef } from "react";
import { isStageMessage } from "../stage/channel";
import { actionForKey, isEditableTarget, type ShortcutAction } from "./shortcuts";

/**
 * Binds the shell's shortcuts. Keys pressed in the shell document arrive as
 * keydown; keys pressed while a stage iframe has focus arrive as channel
 * messages that the stage forwards (it has already skipped editable targets).
 * Both paths resolve through the same `actionForKey`.
 */
export function useShortcuts(onAction: (action: ShortcutAction) => void) {
  const handler = useRef(onAction);
  useEffect(() => {
    handler.current = onAction;
  }, [onAction]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || isEditableTarget(event.target)) return;
      const action = actionForKey(event);
      if (!action) return;
      // Space would scroll the pane; "?" would type nowhere useful. Browser
      // combinations never reach here because modified keys map to null.
      event.preventDefault();
      handler.current(action);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !isStageMessage(event.data) || event.data.type !== "key") return;
      const action = actionForKey(event.data);
      if (action) handler.current(action);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("message", onMessage);
    };
  }, []);
}
