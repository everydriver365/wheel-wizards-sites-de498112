import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import {
  COURSE_INTERESTS,
  TIMINGS,
  TRANSMISSIONS,
  displayName,
  type Instructor,
} from "@/lib/site";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "inherit",
  color: "#0B1F3A",
  background: "#F8F9FB",
  border: "1px solid #E4E8EF",
  borderRadius: 12,
  outline: "none",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", textAlign: "left" }}>
      <span
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 700,
          color: "#6B7686",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
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
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    transmission: "No preference",
    hours: "",
    timing: "Flexible",
    startDate: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      toast.error("Please add your name and phone number.");
      return;
    }
    setSubmitting(true);
    const postcodeMatch = form.address
      .toUpperCase()
      .match(/[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}/);

    const { error } = await supabase.from("enquiries").insert({
      instructor_id: instructor.id,
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      postcode: postcodeMatch ? postcodeMatch[0] : null,
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

  if (sent) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 4px 0 #E4E4E8, 0 16px 48px rgba(11,31,58,0.1)",
        }}
      >
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
        <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0B1F3A" }}>Enquiry sent!</h3>
        <p style={{ fontSize: 15, color: "#6B7686", marginTop: 8 }}>
          {displayName(instructor)} will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        borderRadius: 24,
        padding: 32,
        boxShadow: "0 4px 0 #E4E4E8, 0 16px 48px rgba(11,31,58,0.1)",
        display: "grid",
        gap: 14,
      }}
    >
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
      <Field label="Pickup address">
        <input
          style={inputStyle}
          value={form.address}
          onChange={set("address")}
          placeholder="Street and postcode"
          maxLength={200}
          autoComplete="street-address"
        />
      </Field>
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
          color: "#fff",
          borderRadius: 16,
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