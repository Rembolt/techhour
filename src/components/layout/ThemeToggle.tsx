"use client";

import { useLayoutEffect } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prefersDark, THEME_KEY } from "@/lib/theme";

/** Light bulb in light mode, switched-off bulb in dark mode. */
export default function ThemeToggle({ className }: { className?: string }) {
  // React's dev remount clears the class the head script set; put it back.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", prefersDark());
  }, []);

  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {}
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle light and dark mode"
      onClick={toggle}
      // The canvas captures the pointer on press, which would swallow the click.
      onPointerDown={(e) => e.stopPropagation()}
      className={className}
    >
      <Lightbulb className="dark:hidden" />
      <LightbulbOff className="hidden dark:block" />
    </Button>
  );
}
