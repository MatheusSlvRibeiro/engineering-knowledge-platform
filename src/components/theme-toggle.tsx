"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// No-op subscription: this store never changes after mount, we only use
// useSyncExternalStore to get a snapshot that differs between server and
// client render without triggering a "set state in effect" pattern.
function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-7 w-7" aria-hidden />;
  }

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
      className="text-fg-muted hover:bg-canvas-subtle hover:text-fg flex h-7 w-7 items-center justify-center rounded-md transition-colors"
    >
      {isDark ? (
        <Moon width={16} height={16} aria-hidden="true" />
      ) : (
        <Sun width={16} height={16} aria-hidden="true" />
      )}
    </button>
  );
}
