import { useState } from "react";
import { toast } from "sonner";

import AddressAutocompleteField from "@/components/AddressAutocomplete";
import { supabase } from "@/lib/supabase";
import {
  COURSE_INTERESTS,
  TIMINGS,
  TRANSMISSIONS,
  displayName,
  type Instructor,
} from "@/lib/site";
import { FONT_HEADING, T } from "@/lib/theme";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "inherit",
  color: T.navy,
  background: T.white,
  border: `1px solid ${T.border}`,
  borderRadius: 10,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: T.muted,
  marginBottom: 6,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", textAlign: "left" }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}

export function EnquiryForm({
  instructor,
  accent,
  courseInterest,
  onCourseInterestChange,
}: {
  instructor: Instructor;
  accent: string;
  courseInterest: string;
  onCourseInterestChange: (value: string) => void;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    transmission: "No preference",
    hours: "",
    timing: "Flexible",
    startDate: "",
    message: "",
  });

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      toast.error("Please add your name and phone number.");
      return;
    }
    setSubmitting(true);
    const derivedPostcode =
      postcode || address.toUpperCase().match(/[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}/)?.[0] || null;

    const { error } = await supabase.from("enquiries").insert({
      instructor_id: instructor.id,
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      postcode: derivedPostcode,
      course_interest: courseInterest || null,
      transmission: form.transmission,
      requested_hours: form.hours ? Number(form.hours) : null,
      preferred_timing: form.timing,
      preferred_start_date: form.startDate || null,
      notes: form.message.trim() || null,
      status: "new",
    });
    setSubmitting(false);

    if (error) {
      toast.error("Sorry, that didn't send. Please try again or call directly.");
      return;
    }
    setSent(true);
  }

  const cardStyle: React.CSSProperties = {
    background: T.white,
    borderRadius: 24,
    padding: 32,
    border: `1px solid ${T.border}`,
    boxShadow: "0 1px 2px rgba(12,35,64,0.04), 0 18px 44px rgba(12,35,64,0.09)",
  };

  if (sent) {
    return (
      <div style={cardStyle}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#DCFCE7",
            color: "#15803D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 30,
          }}
          aria-hidden="true"
        >
          ✓
        </div>
        <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: T.navy }}>
          Enquiry sent!
        </h3>
        <p style={{ fontSize: 15, color: T.muted, marginTop: 8 }}>
          {displayName(instructor)} will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ ...cardStyle, display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="First name *">
          <input style={inputStyle} value={form.firstName} onChange={set("firstName")} required maxLength={60} />
        </Field>
        <Field label="Last name *">
          <input style={inputStyle} value={form.lastName} onChange={set("lastName")} required maxLength={60} />
        </Field>
      </div>
      <Field label="Phone *">
        <input style={inputStyle} type="tel" value={form.phone} onChange={set("phone")} required maxLength={30} />
      </Field>
      <Field label="Email">
        <input style={inputStyle} type="email" value={form.email} onChange={set("email")} maxLength={255} />
      </Field>
      <div style={{ textAlign: "left" }}>
        <AddressAutocompleteField
          label="Pickup address"
          value={address}
          onChange={setAddress}
          onPostcodeExtracted={setPostcode}
          placeholder="Start typing your address"
          style={inputStyle}
        />
      </div>
      <Field label="Course interest">
        <select
          style={inputStyle}
          value={courseInterest}
          onChange={(event) => onCourseInterestChange(event.target.value)}
        >
          <option value="">Select a course</option>
          {COURSE_INTERESTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {courseInterest && !COURSE_INTERESTS.includes(courseInterest) ? (
            <option value={courseInterest}>{courseInterest}</option>
          ) : null}
        </select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Transmission">
          <select style={inputStyle} value={form.transmission} onChange={set("transmission")}>
            {TRANSMISSIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Hours needed">
          <input style={inputStyle} type="number" min={1} max={200} value={form.hours} onChange={set("hours")} />
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Preferred timing">
          <select style={inputStyle} value={form.timing} onChange={set("timing")}>
            {TIMINGS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred start date">
          <input style={inputStyle} type="date" value={form.startDate} onChange={set("startDate")} />
        </Field>
      </div>
      <Field label="Message">
        <textarea
          style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
          value={form.message}
          onChange={set("message")}
          maxLength={1000}
          placeholder="Tell them a little about your experience so far…"
        />
      </Field>
      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          background: accent,
          color: T.white,
          borderRadius: 14,
          padding: 16,
          fontSize: 16,
          fontWeight: 700,
          border: "none",
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.7 : 1,
          marginTop: 4,
        }}
      >
        {submitting ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}