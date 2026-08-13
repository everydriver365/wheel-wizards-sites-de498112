import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { DEFAULT_ACCENT, displayName, type Instructor } from "@/lib/site";

export const Route = createFileRoute("/$slug/booking-confirmed")({
  head: () => ({
    meta: [
      { title: "Booking confirmed — DSM Sites" },
      { name: "description", content: "Your driving course booking is confirmed." },
      { property: "og:title", content: "Booking confirmed" },
      { property: "og:description", content: "Your driving course booking is confirmed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingConfirmedPage,
});

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";
const NAVY = "#0B1F3A";

function BookingConfirmedPage() {
  const { slug } = Route.useParams();
  const [instructor, setInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("instructors_public")
        .select("*")
        .eq("app_slug", slug)
        .single();
      if (active) setInstructor((data as Instructor) ?? null);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const accent = instructor?.brand_colour || DEFAULT_ACCENT;
  const name = instructor ? displayName(instructor) : "your instructor";
  const phone = instructor?.["phone"] ? String(instructor["phone"]) : null;

  return (
    <div
      style={{
        background: "#F8F9FB",
        minHeight: "100vh",
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <main style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 999,
            background: "#DCFCE7",
            color: "#15803D",
            fontSize: 34,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          ✓
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: NAVY, marginBottom: 10 }}>
          Booking confirmed!
        </h1>
        <p style={{ fontSize: 14, color: "#6B7686", lineHeight: 1.6, marginBottom: 24 }}>
          Thanks — your place is booked with {name}. They&apos;ll be in touch to arrange your first
          session.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 1px 3px rgba(11,31,58,0.06)",
            padding: 18,
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Need to get in touch?
          </p>
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              style={{ fontSize: 20, fontWeight: 800, color: accent, textDecoration: "none" }}
            >
              {phone}
            </a>
          ) : (
            <a
              href={`/${slug}/enquire`}
              style={{ fontSize: 15, fontWeight: 700, color: accent, textDecoration: "none" }}
            >
              Send {name} a message →
            </a>
          )}
        </div>

        <a
          href={`/${slug}`}
          style={{
            display: "inline-block",
            background: accent,
            color: "#fff",
            borderRadius: 16,
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to {name}
        </a>
      </main>
    </div>
  );
}