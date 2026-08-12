import { darken } from "@/lib/site";

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";
const NAVY = "#0F2044";
const TEAL = "#2D8A9E";

interface IOSCourseCardProps {
  course: {
    id: string;
    name?: string | null;
    course_type?: string | null;
    total_hours?: number | null;
    price?: number | null;
    start_date?: string | null;
    available_from?: string | null;
    image_url?: string | null;
  };
  instructor: {
    name?: string | null;
    trading_name?: string | null;
    brand_colour?: string | null;
    city?: string | null;
    postcode?: string | null;
  };
  onEnquire?: () => void;
  enquireHref?: string;
}

function transmissionLabel(text: string) {
  const t = text.toLowerCase();
  if (t.includes("auto")) return "Automatic";
  if (t.includes("electric")) return "Electric";
  return "Manual";
}

function typeLabel(courseType?: string | null, name?: string | null) {
  const raw = (courseType || "").trim();
  const source = `${courseType ?? ""} ${name ?? ""}`.toLowerCase();
  if (raw) return raw.charAt(0).toUpperCase() + raw.slice(1);
  if (source.includes("intensive")) return "Intensive";
  if (source.includes("pass plus") || source.includes("motorway")) return "Pass Plus";
  return "Lessons";
}

function splitDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    short: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
  };
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" />
      <path d="M9.5 7H17a2 2 0 0 1 0 4h-6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export default function IOSCourseCard({ course, instructor, onEnquire, enquireHref }: IOSCourseCardProps) {
  const brand = instructor.brand_colour || NAVY;
  const title = course.name || `${course.total_hours ?? ""} hour driving lessons`.trim();
  const date = splitDate(course.available_from || course.start_date);
  const withName = instructor.trading_name || instructor.name || "your instructor";
  const location = [instructor.city, instructor.postcode].filter(Boolean).join(" · ");
  const type = typeLabel(course.course_type, course.name);
  const transmission = transmissionLabel(`${course.course_type ?? ""} ${course.name ?? ""}`);

  return (
    <a
      href={enquireHref ?? "#"}
      onClick={(event) => {
        if (!enquireHref) event.preventDefault();
        onEnquire?.();
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
      }}
      style={{
        display: "block",
        textDecoration: "none",
        background: "#fff",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 4px 0 #E4E4E8, 0 10px 26px rgba(11,31,58,0.08)",
        transition: "transform 160ms ease",
        fontFamily: FONT,
        height: "100%",
      }}
    >
      {/* Image with pill badges */}
      <div style={{ position: "relative" }}>
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={title}
            loading="lazy"
            style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              height: 200,
              background: `linear-gradient(135deg, ${brand}, ${darken(brand, 0.35)})`,
            }}
          />
        )}

        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: brand,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 999,
              padding: "7px 14px",
              boxShadow: "0 2px 8px rgba(11,31,58,0.25)",
            }}
          >
            <BoltIcon />
            {type}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              color: NAVY,
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 999,
              padding: "7px 14px",
              boxShadow: "0 2px 8px rgba(11,31,58,0.18)",
            }}
          >
            <GearIcon />
            {transmission}
          </span>
        </div>
      </div>

      {/* Date rail + details */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {date ? (
          <div
            style={{
              background: brand,
              color: "#fff",
              width: 96,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "26px 0",
            }}
          >
            <span style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{date.day}</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", marginTop: 6 }}>
              {date.month}
            </span>
          </div>
        ) : null}

        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: NAVY, lineHeight: 1.25 }}>{title}</h3>

          {course.total_hours != null ? (
            <span style={row}>
              <ClockIcon />
              <span style={{ color: "#6B7686" }}>
                {course.total_hours} hours{date ? ` (${date.short})` : ""}
              </span>
            </span>
          ) : null}

          {location ? (
            <span style={row}>
              <PinIcon />
              <span style={{ color: NAVY, fontWeight: 600 }}>{location}</span>
            </span>
          ) : null}

          <span style={row}>
            <PersonIcon />
            <span style={{ color: "#6B7686" }}>
              With <strong style={{ color: NAVY, fontWeight: 700 }}>{withName}</strong>
            </span>
          </span>

          {course.price != null ? (
            <span style={{ fontSize: 26, fontWeight: 800, color: NAVY, marginTop: 6 }}>
              From £{course.price}
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 9,
  fontSize: 15,
};