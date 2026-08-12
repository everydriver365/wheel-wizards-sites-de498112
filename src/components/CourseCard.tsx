import { darken, formatDate } from "@/lib/site";

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";

interface CourseCardProps {
  course: {
    id: string;
    name?: string | null;
    course_type: string | null;
    total_hours: number | null;
    price: number | null;
    start_date: string | null;
    available_from: string | null;
    image_url: string | null;
    description: string | null;
  };
  instructor: {
    id: string;
    name?: string | null;
    trading_name?: string | null;
    profile_image_url?: string | null;
    brand_colour?: string | null;
    hourly_rate?: number | null;
    city?: string | null;
  };
  onEnquire: () => void;
}

function courseIcon(courseType?: string | null, name?: string | null) {
  const t = `${courseType ?? ""} ${name ?? ""}`.toLowerCase();
  if (t.includes("motorway") || t.includes("pass plus")) return "🛣️";
  if (t.includes("intensive") || t.includes("semi")) return "🏎️";
  if (t.includes("auto") || t.includes("electric")) return "⚡";
  return "🚗";
}

export default function CourseCard({ course, instructor, onEnquire }: CourseCardProps) {
  const brand = instructor.brand_colour || "#0F2044";
  const buttonColour = instructor.brand_colour || "#1877D6";
  const fromDate = formatDate(course.available_from || course.start_date);
  const withName = instructor.trading_name || instructor.name || "your instructor";

  return (
    <article
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
      }}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 4px 0 #E4E4E8, 0 8px 20px rgba(11,31,58,0.06)",
        cursor: "pointer",
        transition: "transform 150ms ease",
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT,
      }}
    >
      {/* Top — image or coloured banner */}
      <div style={{ position: "relative" }}>
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.name || course.course_type || "Driving course"}
            loading="lazy"
            style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              height: 180,
              background: `linear-gradient(135deg, ${brand}, ${darken(brand, 0.3)})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
              aria-hidden="true"
            >
              {courseIcon(course.course_type, course.name)}
            </span>
          </div>
        )}

        {/* Badges */}
        {course.course_type ? (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 20,
              padding: "4px 10px",
              textTransform: "uppercase",
              backdropFilter: "blur(4px)",
              letterSpacing: "0.05em",
            }}
          >
            {course.course_type}
          </span>
        ) : null}

        {fromDate ? (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: brand,
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 20,
              padding: "4px 10px",
            }}
          >
            From {fromDate}
          </span>
        ) : null}
      </div>

      {/* Bottom — content */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0B1F3A",
            marginBottom: 6,
            fontFamily: FONT,
          }}
        >
          {course.name || course.course_type || "Driving course"}
        </h3>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          {course.total_hours != null ? (
            <span style={detail}>🕐 {course.total_hours} hours</span>
          ) : null}
          {course.price != null ? <span style={detail}>💷 From £{course.price}</span> : null}
          {instructor.city ? <span style={detail}>📍 {instructor.city}</span> : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
            paddingTop: 10,
            borderTop: "1px solid #E4E8EF",
          }}
        >
          {instructor.profile_image_url ? (
            <img
              src={instructor.profile_image_url}
              alt={withName}
              loading="lazy"
              style={{ width: 28, height: 28, borderRadius: 999, objectFit: "cover" }}
            />
          ) : (
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "#E4E8EF",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#0B1F3A",
              }}
            >
              {withName.trim().charAt(0).toUpperCase()}
            </span>
          )}
          <span style={{ fontSize: 12, color: "#6B7686" }}>with {withName}</span>
        </div>

        <button
          onClick={onEnquire}
          style={{
            marginTop: "auto",
            width: "100%",
            background: buttonColour,
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: "11px 0",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONT,
            boxShadow: `0 3px 0 ${darken(buttonColour, 0.25)}`,
          }}
        >
          Enquire about this course
        </button>
      </div>
    </article>
  );
}

const detail: React.CSSProperties = {
  display: "flex",
  gap: 4,
  alignItems: "center",
  fontSize: 12,
  color: "#6B7686",
};
