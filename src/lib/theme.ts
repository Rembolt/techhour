export const THEME_KEY = "theme";

/** A saved choice wins; with none, the visitor's system setting decides. */
export function prefersDark() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === "dark";
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Runs in <head> before first paint so the page never flashes the wrong
 * theme. Keep it in step with prefersDark above.
 */
export const themeScript = `(function(){try{var t;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
