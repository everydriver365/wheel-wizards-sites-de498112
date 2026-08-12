import { useEffect, useMemo, useState } from "react";

import { EnquiryForm } from "./EnquiryForm";
import {
  CARD_SHADOW,
  DEFAULT_ACCENT,
  alpha,
  darken,
  displayName,
  formatDate,
  scrollToId,
  type Course,
  type Instructor,
  type Review,
} from "@/lib/site";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "courses", label: "Courses" },
  { id: "reviews", label: "Reviews" },
  { id: "enquiry", label: "Contact" },
];

function Stars({ count = 5, color }: { count?: number; color: string }) {
  return (
    <span style={{ color, letterSpacing: 1 }} aria-hidden="true">
      {"★★★★★".slice(0, Math.max(0, Math.round(count)))}
    </span>
  );
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: accent,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  );
}

export function InstructorSite({
  instructor,
  courses,
  reviews,
}: {
  instructor: Instructor;
  courses: Course[];
  reviews: Review[];
}) {
  const accent = instructor.brand_colour || DEFAULT_ACCENT;
  const name = displayName(instructor);
  const [scrolled, setScrolled] = useState(false);
  const [courseInterest, setCourseInterest] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating ?? 5), 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const heroImage = instructor.website_hero_image_url || instructor.profile_image_url || "";

  const stats = [
    { value: `${reviews.length}+`, label: "Happy pupils" },
    { value: instructor.dvsa_grade || "ADI", label: "DVSA grade" },
    { value: instructor.dvsa_type || "Qualified", label: "Licence type" },
    { value: `${courses.length}+`, label: "Courses" },
  ];

  const badges = [
    instructor.dvsa_type ? String(instructor.dvsa_type).toUpperCase() : null,
    instructor.dvsa_grade ? `Grade ${String(instructor.dvsa_grade).replace(/grade\s*/i, "")}` : null,
    instructor.dbs_uploaded ? "DBS Checked" : null,
  ].filter(Boolean) as string[];

  const goEnquire = (interest?: string) => {
    if (interest) setCourseInterest(interest);
    scrollToId("enquiry");
  };

  return (
    <div style={{ background: "#F8F9FB", color: "#0B1F3A", fontFamily: "Poppins, system-ui, sans-serif" }}>
      {/* 1. Sticky nav */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          padding: "0 24px",
          background: "#fff",
          borderBottom: "1px solid #E4E8EF",
          boxShadow: "0 2px 8px rgba(11,31,58,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 50,
          transform: scrolled ? "translateY(0)" : "translateY(-100%)",
          opacity: scrolled ? 1 : 0,
          transition: "transform 220ms ease, opacity 220ms ease",
          pointerEvents: scrolled ? "auto" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {instructor.profile_image_url ? (
            <img
              src={instructor.profile_image_url}
              alt={name}
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : null}
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0B1F3A" }}>{name}</span>
        </div>
        <nav className="hidden md:flex" style={{ gap: 24 }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToId(link.id)}
              style={{ fontSize: 14, color: "#6B7686", background: "none", border: "none", cursor: "pointer" }}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => goEnquire()}
          style={{
            background: accent,
            color: "#fff",
            borderRadius: 50,
            padding: "8px 20px",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Book now
        </button>
      </header>

      {/* 2. Hero */}
      <section
        style={{
          position: "relative",
          height: "100dvh",
          minHeight: 520,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          overflow: "hidden",
          background: "#0B1F3A",
        }}
      >
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {name}
          </p>
          <h1
            style={{
              fontSize: "clamp(32px, 6vw, 64px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: 700,
              marginBottom: 16,
            }}
          >
            Driving lessons in {instructor.city || "your area"}
          </h1>
          {reviews.length > 0 ? (
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 24 }}>
              <Stars count={5} color="#FFC53D" /> {avgRating} · {reviews.length} reviews
            </p>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => goEnquire()}
              style={{
                background: accent,
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 50,
                fontSize: 16,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: `0 4px 0 ${darken(accent, 0.3)}`,
              }}
            >
              Book a lesson
            </button>
            <button
              onClick={() => goEnquire()}
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 50,
                fontSize: 16,
                fontWeight: 700,
                border: "1.5px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
              }}
            >
              Get in touch
            </button>
          </div>
        </div>
        <p
          style={{
            position: "absolute",
            bottom: 32,
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
          }}
        >
          Scroll to explore ↓
        </p>
      </section>

      {/* 3. Stats bar */}
      <section style={{ background: "#fff", padding: "28px 24px", borderBottom: "1px solid #E4E8EF" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                borderLeft: index === 0 ? "none" : "1px solid #E4E8EF",
                padding: "0 8px",
              }}
            >
              <p style={{ fontSize: 28, fontWeight: 800, color: accent, lineHeight: 1.2 }}>{stat.value}</p>
              <p style={{ fontSize: 12, color: "#6B7686" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. About */}
      <section id="about" style={{ background: "#F8F9FB", padding: "80px 24px", scrollMarginTop: 60 }}>
        <div
          style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}
        >
          {instructor.profile_image_url ? (
            <img
              src={instructor.profile_image_url}
              alt={name}
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                objectFit: "cover",
                border: `4px solid ${accent}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                flexShrink: 0,
                margin: "0 auto",
              }}
            />
          ) : null}
          <div style={{ flex: "1 1 320px", minWidth: 260 }}>
            <SectionLabel accent={accent}>About</SectionLabel>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0B1F3A", marginBottom: 16 }}>About {name}</h2>
            <p style={{ fontSize: 16, color: "#6B7686", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {instructor.website_bio ||
                `${name} offers patient, professional driving tuition tailored to every learner — from complete beginners to refresher lessons before your test.`}
            </p>
            {badges.length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                {badges.map((badge) => (
                  <span
                    key={badge}
                    style={{
                      background: "#0B1F3A",
                      color: "#fff",
                      borderRadius: 50,
                      padding: "4px 12px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 5. Courses */}
      <section id="courses" style={{ background: "#fff", padding: "80px 24px", scrollMarginTop: 60 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionLabel accent={accent}>Courses &amp; packages</SectionLabel>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0B1F3A", marginBottom: 24 }}>Choose your course</h2>
          {courses.length === 0 ? (
            <p style={{ fontSize: 16, color: "#6B7686" }}>
              Contact {instructor.name || name} to discuss available courses.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 20 }}>
              {courses.map((course) => {
                const startDate = formatDate(course.start_date || course.available_from);
                return (
                  <article
                    key={course.id}
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      padding: 24,
                      boxShadow: CARD_SHADOW,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: alpha(accent, 0.15),
                          color: accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        🚗
                      </span>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0B1F3A", flex: 1 }}>
                        {course.name || course.course_type || "Driving course"}
                      </h3>
                      {course.price != null ? (
                        <span
                          style={{
                            background: accent,
                            color: "#fff",
                            borderRadius: 50,
                            padding: "4px 12px",
                            fontSize: 13,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          £{course.price}
                        </span>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                      {course.total_hours != null ? (
                        <span style={{ fontSize: 12, color: "#6B7686" }}>🕐 {course.total_hours} hours</span>
                      ) : null}
                      {startDate ? <span style={{ fontSize: 12, color: "#6B7686" }}>Starts {startDate}</span> : null}
                      {course.transmission ? (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#0B1F3A",
                            background: "#F8F9FB",
                            border: "1px solid #E4E8EF",
                            borderRadius: 50,
                            padding: "3px 10px",
                          }}
                        >
                          {course.transmission}
                        </span>
                      ) : null}
                    </div>
                    {course.description ? (
                      <p style={{ fontSize: 14, color: "#6B7686", lineHeight: 1.6 }}>{course.description}</p>
                    ) : null}
                    <button
                      onClick={() => goEnquire(course.name || course.course_type || "")}
                      style={{
                        marginTop: "auto",
                        width: "100%",
                        background: accent,
                        color: "#fff",
                        border: "none",
                        borderRadius: 50,
                        padding: 10,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Enquire about this course
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. Reviews */}
      {reviews.length > 0 ? (
        <section id="reviews" style={{ background: "#F8F9FB", padding: "80px 24px", scrollMarginTop: 60 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionLabel accent={accent}>Reviews</SectionLabel>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0B1F3A", marginBottom: 24 }}>What pupils say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 16 }}>
              {reviews.map((review) => (
                <article
                  key={review.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 20,
                    boxShadow: "0 4px 0 #E4E4E8",
                  }}
                >
                  <Stars count={review.rating ?? 5} color={accent} />
                  <p style={{ fontStyle: "italic", fontSize: 16, color: "#0B1F3A", lineHeight: 1.6, margin: "10px 0 14px" }}>
                    “{review.review_text}”
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0B1F3A" }}>{review.pupil_name || "Pupil"}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDate(review.created_at)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 7. Enquiry */}
      <section id="enquiry" style={{ background: "#fff", padding: "80px 24px", scrollMarginTop: 60 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel accent={accent}>Get in touch</SectionLabel>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0B1F3A", marginBottom: 8 }}>Send {name} a message</h2>
          <p style={{ fontSize: 15, color: "#6B7686", marginBottom: 28 }}>They'll be in touch within 24 hours.</p>
          <EnquiryForm
            instructor={instructor}
            accent={accent}
            courseInterest={courseInterest}
            onCourseInterestChange={setCourseInterest}
          />
        </div>
      </section>

      {/* 8. Footer */}
      <footer style={{ background: "#0B1F3A", padding: "48px 24px 32px", textAlign: "center" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{name}</p>
        <nav style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", margin: "18px 0" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToId(link.id)}
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>
        {instructor.phone ? (
          <a
            href={`tel:${String(instructor.phone).replace(/\s/g, "")}`}
            style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}
          >
            {instructor.phone}
          </a>
        ) : null}
        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "24px auto 16px", maxWidth: 420 }} />
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <a
          href="https://everydriver.co.uk"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textDecoration: "none" }}
        >
          Powered by EveryDriver
        </a>
      </footer>
    </div>
  );
}