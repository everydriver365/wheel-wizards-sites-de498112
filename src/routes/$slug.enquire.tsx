import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import {
  COURSE_INTERESTS,
  TRANSMISSIONS,
  TIMINGS,
  DEFAULT_ACCENT,
  displayName,
  type Instructor,
} from "@/lib/site";

export const Route = createFileRoute("/$slug/enquire")({
  validateSearch: (search: Record<string, unknown>) => ({
    course: typeof search["course"] === "string" ? (search["course"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Send an enquiry — DSM Sites" },
      { name: "description", content: "Send your driving instructor an enquiry about lessons, intensive courses and availability." },
      { property: "og:title", content: "Send an enquiry" },
      { property: "og:description", content: "Tell your instructor what you need and they'll be in touch soon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EnquirePage,
});

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";

function EnquirePage() {
  const { slug } = Route.useParams();
  const { course: courseParam } = Route.useSearch();
  const navigate = useNavigate();

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [course, setCourse] = useState(courseParam ?? "");
  const [transmission, setTransmission] = useState("");
  const [hours, setHours] = useState("");
  const [timing, setTiming] = useState("");
  const [startDate, setStartDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("instructors_public")
      .select("*")
      .eq("app_slug", slug)
      .single()
      .then(({ data }) => {
        if (!active) return;
        setInstructor((data as Instructor) ?? null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const accent = instructor?.brand_colour || DEFAULT_ACCENT;
  const name = instructor ? displayName(instructor) : "your instructor";

  async function handleSubmit() {
    if (!instructor) return;
    if (!firstName.trim() || !phone.trim()) {
      setError("Please enter your name and phone");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const notes = [address.trim() ? `Pickup address: ${address.trim()}` : null, message.trim() || null]
        .filter(Boolean)
        .join("\n");
      const { error: err } = await supabase.from("enquiries").insert({
        instructor_id: instructor.id,
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        postcode: postcode.trim() || null,
        course_interest: course || null,
        transmission: transmission || null,
        requested_hours: hours ? parseInt(hours, 10) : null,
        preferred_timing: timing || null,
        preferred_start_date: startDate || null,
        notes: notes || null,
        status: "new",
      });
      if (err) throw err;
      setSubmitted(true);
    } catch (e) {
      setError((e as { message?: string })?.message ?? "Could not send enquiry");
    } finally {
      setSubmitting(false);
    }
  }

  const goBack = () => navigate({ to: "/$slug", params: { slug } });

  return (
    <div style={{ background: "#F8F9FB", minHeight: "100vh", fontFamily: FONT }}>
      {/* Header */}
      <header
        style={{
          background: accent,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <button
          onClick={goBack}
          aria-label="Back to profile"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "rgba(255,255,255,0.15)",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: 18,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ←
        </button>
        {instructor?.["logo_url"] ? (
          <img
            src={String(instructor["logo_url"])}
            alt={name}
            style={{ height: 32, maxWidth: 140, objectFit: "contain" }}
          />
        ) : instructor?.profile_image_url ? (
          <img
            src={instructor.profile_image_url}
            alt={name}
            style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : null}
        <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: FONT }}>
          {loading ? "Loading…" : name}
        </span>
      </header>

      <main style={{ maxWidth: 560, margin: "0 auto", padding: "32px 16px 80px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0B1F3A", marginBottom: 4 }}>
          Get in touch
        </h1>
        <p style={{ fontSize: 14, color: "#6B7686", marginBottom: 24 }}>
          Send {name} a message
        </p>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: "#DCFCE7",
                color: "#15803D",
                fontSize: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              ✓
            </div>
            <p style={{ fontSize: 20, fontWeight: 800, color: "#0B1F3A" }}>Enquiry sent!</p>
            <p style={{ fontSize: 14, color: "#6B7686", marginTop: 8 }}>
              {name} will be in touch soon.
            </p>
            <button
              onClick={goBack}
              style={{
                marginTop: 24,
                background: accent,
                color: "#fff",
                border: "none",
                borderRadius: 50,
                padding: "12px 32px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Back to profile
            </button>
          </div>
        ) : (
          <>
            <SectionLabel>Your details</SectionLabel>
            <Card>
              <Row label="First name">
                <input
                  style={inputStyle}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Required"
                  maxLength={60}
                />
              </Row>
              <Row label="Last name">
                <input
                  style={inputStyle}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={60}
                />
              </Row>
              <Row label="Phone">
                <input
                  style={inputStyle}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Required"
                  maxLength={20}
                />
              </Row>
              <Row label="Email" last>
                <input
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                />
              </Row>
            </Card>

            <SectionLabel>Your lessons</SectionLabel>
            <Card>
              <Row label="Pickup address">
                <input
                  style={inputStyle}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, town"
                  maxLength={160}
                />
              </Row>
              <Row label="Postcode">
                <input
                  style={inputStyle}
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  maxLength={10}
                />
              </Row>
              <Row label="Course">
                <select style={inputStyle} value={course} onChange={(e) => setCourse(e.target.value)}>
                  <option value="">Select</option>
                  {COURSE_INTERESTS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Row>
              <Row label="Transmission">
                <select
                  style={inputStyle}
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                >
                  <option value="">Select</option>
                  {TRANSMISSIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Row>
              <Row label="Hours needed">
                <input
                  style={inputStyle}
                  type="number"
                  min={1}
                  max={200}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </Row>
              <Row label="Preferred timing">
                <select style={inputStyle} value={timing} onChange={(e) => setTiming(e.target.value)}>
                  <option value="">Select</option>
                  {TIMINGS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Row>
              <Row label="Start date" last>
                <input
                  style={inputStyle}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Row>
            </Card>

            <SectionLabel>Message</SectionLabel>
            <Card>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Anything else you'd like us to know?"
                maxLength={1000}
                style={{
                  minHeight: 100,
                  border: "none",
                  outline: "none",
                  width: "100%",
                  resize: "none",
                  fontSize: 14,
                  color: "#0B1F3A",
                  padding: "14px 16px",
                  fontFamily: FONT,
                  background: "transparent",
                  display: "block",
                }}
              />
            </Card>

            {error ? (
              <p style={{ fontSize: 13, color: "#CC2229", marginBottom: 12, textAlign: "center" }}>
                {error}
              </p>
            ) : null}

            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                paddingTop: 32,
                background: "linear-gradient(transparent, #F8F9FB)",
              }}
            >
              <div style={{ maxWidth: 560, margin: "0 auto" }}>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || loading}
                  style={{
                    width: "100%",
                    background: accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 16,
                    padding: 16,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: FONT,
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Sending..." : "Send enquiry"}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(11,31,58,0.06)",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  children,
  last,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 16px",
        gap: 12,
        borderBottom: last ? "none" : "1px solid #E4E8EF",
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#6B7686",
          width: 120,
          flexShrink: 0,
          fontFamily: FONT,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 15,
  color: "#0B1F3A",
  textAlign: "left",
  background: "transparent",
  fontFamily: FONT,
  minWidth: 0,
};
