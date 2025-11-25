"use client";

import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Prevent default behavior for form elements unless it's Escape
          if (
            shortcut.key !== "Escape" &&
            (event.target instanceof HTMLInputElement ||
              event.target instanceof HTMLTextAreaElement)
          ) {
            return;
          }

          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: { key: "n", description: "Create new task" },
  SEARCH: { key: "/", description: "Focus search" },
  ESCAPE: { key: "Escape", description: "Close dialog/modal" },
  SAVE: { key: "s", ctrlKey: true, description: "Save (Ctrl+S)" },
  HELP: { key: "?", shiftKey: true, description: "Show keyboard shortcuts" },
};
