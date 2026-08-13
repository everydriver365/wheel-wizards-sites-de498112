import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AddressAutocompleteField } from "@/components/AddressAutocomplete";
import { DEFAULT_ACCENT, displayName, type Course, type Instructor } from "@/lib/site";

const SUPABASE_URL = "https://bjpqxfrihwjcqprmoqfs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcHF4ZnJpaHdqY3Fwcm1vcWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NzQ4MjEsImV4cCI6MjA5NzA1MDgyMX0.HKlgx3dxP3uxX9wMRRUnfb0IPwaBpFcut_iUgT5XFeo";

export const Route = createFileRoute("/$slug/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    course: typeof search["course"] === "string" ? (search["course"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book your course — DSM Sites" },
      { name: "description", content: "Book and pay for your driving course online in a few quick steps." },
      { property: "og:title", content: "Book your driving course" },
      { property: "og:description", content: "Enter your details, confirm pickup and pay securely online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookPage,
});

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";
const NAVY = "#0B1F3A";

function BookPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const courseId = search.course;
  const navigate = useNavigate();

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsChecked, setTermsChecked] = useState(false);

  function clearError(field: string) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e["firstName"] = "First name is required";
    if (!lastName.trim()) e["lastName"] = "Last name is required";
    if (!phone.trim()) e["phone"] = "Phone number is required";
    else if (!/^[\d\s+()-]{7,15}$/.test(phone.trim())) e["phone"] = "Enter a valid phone number";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e["email"] = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {};
    if (!pickupAddress.trim()) e["pickupAddress"] = "Please enter your pickup address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: inst } = await supabase
        .from("instructors_public")
        .select("*")
        .eq("app_slug", slug)
        .single();
      let crs: Course | null = null;
      if (courseId) {
        const { data } = await supabase
          .from("instructor_courses")
          .select("*")
          .eq("id", courseId)
          .single();
        crs = (data as Course) ?? null;
      }
      if (!active) return;
      setInstructor((inst as Instructor) ?? null);
      setCourse(crs);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug, courseId]);

  const accent = instructor?.brand_colour || DEFAULT_ACCENT;
  const name = instructor ? displayName(instructor) : "your instructor";
  const price = course?.price ?? 0;
  const isFree = !course?.price || Number(course.price) === 0;

  async function confirmFreeBooking() {
    if (!instructor) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("course_bookings").insert({
        instructor_id: instructor.id,
        course_id: courseId,
        pupil_first_name: firstName.trim(),
        pupil_last_name: lastName.trim(),
        pupil_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        pupil_phone: phone.trim(),
        pupil_email: email.trim() || null,
        pickup_address: pickupAddress.trim() || null,
        special_needs: notes.trim() || null,
        status: "confirmed",
        amount_paid: 0,
      });
      if (insertError) throw new Error(insertError.message);
      window.location.href = `/${slug}/booking-confirmed`;
    } catch (e) {
      setError((e as { message?: string })?.message ?? "Could not confirm booking");
    } finally {
      setSubmitting(false);
    }
  }

  async function generatePaymentLink() {
    if (!instructor) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/square-create-payment-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          instructor_id: instructor.id,
          amount_pence: Math.round(price * 100),
          description: `${course?.name ?? "Driving course"} — ${firstName} ${lastName}`.trim(),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string; no_square?: boolean };

      if (data.no_square) {
        setError(
          "Online payment is not available for this instructor. Please use the enquiry form instead.",
        );
        return;
      }
      if (data.error) throw new Error(data.error);
      if (!data.url) throw new Error("Could not create payment link");

      // Record the pending booking (best-effort — the payment webhook is the
      // source of truth, so a blocked insert must not stop checkout).
      try {
        await supabase.from("course_bookings").insert({
          instructor_id: instructor.id,
          course_id: courseId,
          pupil_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          pupil_first_name: firstName.trim() || null,
          pupil_last_name: lastName.trim() || null,
          pupil_phone: phone.trim(),
          pupil_email: email.trim() || null,
          pupil_address: pickupAddress.trim() || null,
          pupil_postcode: postcode.trim() || null,
          pickup_address: pickupAddress.trim() || null,
          special_needs: notes.trim() || null,
          status: "pending_payment",
        });
      } catch {
        /* ignore — webhook will record the booking on payment */
      }

      window.location.href = data.url;
    } catch (e) {
      setError((e as { message?: string })?.message ?? "Could not create payment link");
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinue() {
    setError(null);
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    }
  }

  return (
    <div style={{ background: "#F8F9FB", minHeight: "100vh", fontFamily: FONT }}>
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
          onClick={() =>
            step === 1
              ? navigate({ to: "/$slug/courses", params: { slug } })
              : setStep(step === 3 ? 2 : 1)
          }
          aria-label="Back"
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
        <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginLeft: "auto" }}>
          {course?.name ?? ""}
        </span>
      </header>

      {/* Progress */}
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          padding: "20px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {["Details", "Address", "Pay"].map((label, i) => {
          const n = (i + 1) as 1 | 2 | 3;
          const active = step >= n;
          return (
            <div key={label} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 999,
                  background: active ? accent : "#E4E8EF",
                  marginBottom: 6,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: active ? accent : "#9CA3AF",
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <main style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 100px" }}>
        {step === 1 ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Your details</h1>
            <Card>
              <Row label="First name" error={errors["firstName"]}>
                <input
                  style={inputStyle}
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError("firstName");
                  }}
                  placeholder="Required"
                  maxLength={60}
                />
              </Row>
              <Row label="Last name" error={errors["lastName"]}>
                <input
                  style={inputStyle}
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError("lastName");
                  }}
                  placeholder="Required"
                  maxLength={60}
                />
              </Row>
              <Row label="Phone" error={errors["phone"]}>
                <input
                  style={inputStyle}
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  placeholder="Required"
                  maxLength={20}
                />
              </Row>
              <Row label="Email" last error={errors["email"]}>
                <input
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  maxLength={255}
                />
              </Row>
            </Card>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Pickup address</h1>
            <Card>
              <div
                style={{
                  padding: "14px 16px",
                  borderLeft: errors["pickupAddress"] ? "3px solid #CC2229" : "none",
                }}
              >
                <AddressAutocompleteField
                  label="Full pickup address"
                  value={pickupAddress}
                  onChange={(v) => {
                    setPickupAddress(v);
                    clearError("pickupAddress");
                  }}
                  onPostcodeExtracted={setPostcode}
                  placeholder="Start typing your address"
                />
                {errors["pickupAddress"] ? (
                  <p style={{ fontSize: 12, color: "#CC2229", marginTop: 6 }}>
                    {errors["pickupAddress"]}
                  </p>
                ) : null}
              </div>
            </Card>

            <SectionLabel>Notes / special requirements</SectionLabel>
            <Card>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything your instructor should know?"
                maxLength={1000}
                style={{
                  minHeight: 100,
                  border: "none",
                  outline: "none",
                  width: "100%",
                  resize: "none",
                  fontSize: 14,
                  color: NAVY,
                  padding: "14px 16px",
                  fontFamily: FONT,
                  background: "transparent",
                  display: "block",
                }}
              />
            </Card>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 16 }}>Confirm and pay</h1>
            <Card>
              <div style={{ padding: 16, borderBottom: "1px solid #E4E8EF" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>
                  {course?.name ?? "Driving course"}
                </p>
                {course?.total_hours ? (
                  <p style={{ fontSize: 13, color: "#6B7686", marginTop: 4 }}>
                    {course.total_hours} hours
                  </p>
                ) : null}
                <p style={{ fontSize: 26, fontWeight: 800, color: accent, marginTop: 10 }}>
                  {isFree ? "Free" : `£${price}`}
                </p>
              </div>
              <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                {instructor?.profile_image_url ? (
                  <img
                    src={instructor.profile_image_url}
                    alt={name}
                    style={{ width: 44, height: 44, borderRadius: 999, objectFit: "cover" }}
                  />
                ) : null}
                <div>
                  <p style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                    Your instructor
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{name}</p>
                </div>
              </div>
            </Card>

            <SectionLabel>Booking for</SectionLabel>
            <Card>
              <Row label="Name">
                <span style={valueStyle}>{`${firstName} ${lastName}`.trim() || "—"}</span>
              </Row>
              <Row label="Phone">
                <span style={valueStyle}>{phone || "—"}</span>
              </Row>
              {email.trim() ? (
                <Row label="Email">
                  <span style={valueStyle}>{email.trim()}</span>
                </Row>
              ) : null}
              <Row label="Course">
                <span style={valueStyle}>{course?.name ?? "—"}</span>
              </Row>
              <Row label="Price">
                <span style={valueStyle}>{isFree ? "Free" : `£${price}`}</span>
              </Row>
              <Row label="Pickup" last>
                <span style={valueStyle}>{pickupAddress || "—"}</span>
              </Row>
            </Card>

            {isFree ? (
              <div
                style={{
                  background: "#DCFCE7",
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  marginBottom: 20,
                }}
              >
                <span style={{ color: "#15803D", fontSize: 13, fontWeight: 800 }}>✓</span>
                <span style={{ fontSize: 13, color: "#15803D", lineHeight: 1.5 }}>
                  This is a free course — no payment required
                </span>
              </div>
            ) : null}

            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                style={{ marginTop: 3, flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: "#6B7686", lineHeight: 1.5 }}>
                I confirm my details are correct and agree to the{" "}
                <a href="/terms" target="_blank" rel="noreferrer" style={{ color: "#1877D6" }}>
                  booking terms
                </a>
              </span>
            </label>
          </>
        ) : null}

        {error ? (
          <p style={{ fontSize: 13, color: "#CC2229", marginBottom: 12, textAlign: "center" }}>{error}</p>
        ) : null}
      </main>

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
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <button
            onClick={step === 3 ? (isFree ? confirmFreeBooking : generatePaymentLink) : handleContinue}
            disabled={submitting || loading || (step === 3 && !termsChecked)}
            style={{
              width: "100%",
              background: step === 3 && isFree ? "#15803D" : accent,
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: 16,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: FONT,
              opacity: submitting || loading || (step === 3 && !termsChecked) ? 0.6 : 1,
            }}
          >
            {step === 3 ? (submitting ? "Creating payment…" : `Pay £${price}`) : "Continue →"}
          </button>
        </div>
      </div>
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
  error,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
  error?: string | undefined;
}) {
  return (
    <label
      style={{
        display: "block",
        padding: "14px 16px",
        borderBottom: last ? "none" : "1px solid #E4E8EF",
        borderLeft: error ? "3px solid #CC2229" : "none",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{ fontSize: 13, fontWeight: 500, color: "#6B7686", width: 120, flexShrink: 0, fontFamily: FONT }}
        >
          {label}
        </span>
        {children}
      </span>
      {error ? <span style={{ display: "block", fontSize: 12, color: "#CC2229", marginTop: 6 }}>{error}</span> : null}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 15,
  color: NAVY,
  textAlign: "left",
  background: "transparent",
  fontFamily: FONT,
  minWidth: 0,
};

const valueStyle: React.CSSProperties = { flex: 1, fontSize: 15, color: NAVY, fontWeight: 600 };
