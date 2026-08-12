/**
 * EveryDriver design tokens, reused for the DSM Sites mini-sites.
 * Headings use Sora, body copy uses Manrope (loaded in __root.tsx).
 */
export const T = {
  navy: "#0C2340",
  primary: "#1A4A6E",
  teal: "#2D8A9E",
  surface: "#F3F8FF",
  surfaceSoft: "#F6FAFD",
  iconBg: "#EAF3FB",
  border: "#E8EDF2",
  borderStrong: "#E0E9F3",
  navBorder: "#EEF2F7",
  muted: "#5A6B82",
  white: "#FFFFFF",
} as const;

export const FONT_HEADING = "'Sora', 'Manrope', system-ui, sans-serif";
export const FONT_BODY = "'Manrope', system-ui, -apple-system, sans-serif";

export const CARD_SHADOW_ED = "0 1px 2px rgba(12,35,64,0.04), 0 12px 28px rgba(12,35,64,0.07)";
export const CARD_SHADOW_SOFT = "0 1px 2px rgba(12,35,64,0.04), 0 6px 16px rgba(12,35,64,0.06)";
export const RADIUS = 18;