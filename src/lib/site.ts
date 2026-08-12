export type Instructor = {
  id: string;
  app_slug?: string | null;
  name?: string | null;
  trading_name?: string | null;
  city?: string | null;
  postcode?: string | null;
  phone?: string | null;
  brand_colour?: string | null;
  profile_image_url?: string | null;
  website_hero_image_url?: string | null;
  website_bio?: string | null;
  dvsa_grade?: string | null;
  dvsa_type?: string | null;
  dbs_uploaded?: boolean | null;
  [key: string]: unknown;
};

export type Course = {
  id: string;
  course_type?: string | null;
  name?: string | null;
  total_hours?: number | null;
  price?: number | null;
  start_date?: string | null;
  image_url?: string | null;
  description?: string | null;
  transmission?: string | null;
  available_from?: string | null;
};

export type Review = {
  id: string;
  pupil_name?: string | null;
  rating?: number | null;
  review_text?: string | null;
  created_at?: string | null;
};

export const DEFAULT_ACCENT = "#1A4A6E";

export const CARD_SHADOW =
  "0 1px 2px rgba(12,35,64,0.04), 0 12px 28px rgba(12,35,64,0.07)";

export function displayName(instructor: Instructor) {
  return instructor.trading_name || instructor.name || "Your instructor";
}

/** Darken a hex colour by a ratio (0-1). Falls back to the input if unparsable. */
export function darken(hex: string, ratio = 0.25) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const int = parseInt(m[1]!, 16);
  const r = Math.round(((int >> 16) & 255) * (1 - ratio));
  const g = Math.round(((int >> 8) & 255) * (1 - ratio));
  const b = Math.round((int & 255) * (1 - ratio));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Hex + alpha -> rgba() string. */
export function alpha(hex: string, a: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const int = parseInt(m[1]!, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${a})`;
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function formatDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const COURSE_INTERESTS = [
  "Manual car lessons",
  "Automatic car lessons",
  "Intensive course",
  "Pass Plus",
  "Motorway lessons",
  "Refresher lessons",
];

export const TRANSMISSIONS = ["Manual", "Automatic", "No preference"];

export const TIMINGS = ["Morning", "Afternoon", "Evening", "Flexible"];