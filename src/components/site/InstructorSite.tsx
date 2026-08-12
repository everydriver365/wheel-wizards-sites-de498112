import { useEffect, useMemo, useState } from "react";
import { Clock, CalendarDays, Car, Star } from "lucide-react";

import { EnquiryForm } from "./EnquiryForm";
import {
  DEFAULT_ACCENT,
  alpha,
  displayName,
  formatDate,
  scrollToId,
  type Course,
  type Instructor,
  type Review,
} from "@/lib/site";
import { CARD_SHADOW_ED, CARD_SHADOW_SOFT, FONT_HEADING, T } from "@/lib/theme";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "courses", label: "Courses" },
  { id: "reviews", label: "Reviews" },
  { id: "enquiry", label: "Contact" },
];

const wrap: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };

function Stars({ count = 5, color }: { count?: number; color: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          strokeWidth={0}
          fill={index < Math.round(count) ? color : "#D8E1EC"}
        />
      ))}
    </span>
  );
}

function Eyebrow({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: accent,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 10,
      }}
    >
      {children}
    </p>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: FONT_HEADING,
        fontSize: "clamp(24px, 3vw, 34px)",
        fontWeight: 700,
        color: T.navy,
        marginBottom: 18,
      }}
    >
      {children}
    </h2>
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
    instructor.dvsa_grade
      ? `Grade ${String(instructor.dvsa_grade).replace(/grade\s*/i, "")}`
      : null,
    instructor.dbs_uploaded ? "DBS Checked" : null,
  ].filter(Boolean) as string[];

  const goEnquire = (interest?: string) => {
    if (interest) setCourseInterest(interest);
    scrollToId("enquiry");
  };

  return (
    <div style={{ background: T.white, color: T.navy }}>
      {/* 1. Sticky nav */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: T.white,
          borderBottom: `1px solid ${T.navBorder}`,
          zIndex: 50,
          transform: scrolled ? "translateY(0)" : "translateY(-100%)",
          opacity: scrolled ? 1 : 0,
          transition: "transform 220ms ease, opacity 220ms ease",
          pointerEvents: scrolled ? "auto" : "none",
        }}
      >
        <div
          style={{
            ...wrap,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {instructor.profile_image_url ? (
              <img
                src={instructor.profile_image_url}
                alt={name}
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : null}
            <span style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 800, color: T.navy }}>
              {name}
            </span>
          </div>
          <nav className="hidden lg:flex" style={{ gap: 32 }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToId(link.id)}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.muted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => goEnquire()}
            style={{
              background: accent,
              color: T.white,
              borderRadius: 10,
              padding: "11px 22px",
              border: "none",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Book now
          </button>
        </div>
      </header>

      {/* 2. Hero */}
      <section
        style={{
          position: "relative",
          height: "100dvh",
          minHeight: 540,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          overflow: "hidden",
          background: T.navy,
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
            background:
              "linear-gradient(to bottom, rgba(12,35,64,0.35) 0%, rgba(12,35,64,0.82) 100%)",
          }}
        />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 760 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "rgba(255,255,255,0.72)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {name}
          </p>
          <h1
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(34px, 6vw, 64px)",
              fontWeight: 800,
              color: T.white,
              lineHeight: 1.08,
              marginBottom: 18,
            }}
          >
            Driving lessons in {instructor.city || "your area"}
          </h1>
          {reviews.length > 0 ? (
            <p
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
                marginBottom: 26,
              }}
            >
              <Stars count={5} color="#F4B740" /> {avgRating} · {reviews.length} reviews
            </p>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => goEnquire()}
              style={{
                background: accent,
                color: T.white,
                padding: "15px 32px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 26px rgba(12,35,64,0.35)",
              }}
            >
              Book a lesson
            </button>
            <button
              onClick={() => goEnquire()}
              style={{
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(10px)",
                color: T.white,
                padding: "15px 32px",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                border: "1.5px solid rgba(255,255,255,0.45)",
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
            letterSpacing: "0.08em",
          }}
        >
          Scroll to explore ↓
        </p>
      </section>

      {/* 3. Stats bar */}
      <section style={{ background: T.white, padding: "30px 0", borderBottom: `1px solid ${T.navBorder}` }}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                borderLeft: index === 0 ? "none" : `1px solid ${T.border}`,
                padding: "0 8px",
              }}
            >
              <p
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 28,
                  fontWeight: 800,
                  color: accent,
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. About */}
      <section id="about" style={{ background: T.surface, padding: "88px 0", scrollMarginTop: 80 }}>
        <div style={{ ...wrap, display: "flex", gap: 56, alignItems: "center", flexWrap: "wrap" }}>
          {instructor.profile_image_url ? (
            <img
              src={instructor.profile_image_url}
              alt={name}
              style={{
                width: 210,
                height: 210,
                borderRadius: "50%",
                objectFit: "cover",
                border: `5px solid ${T.white}`,
                boxShadow: "0 18px 42px rgba(12,35,64,0.16)",
                flexShrink: 0,
                margin: "0 auto",
              }}
            />
          ) : null}
          <div style={{ flex: "1 1 340px", minWidth: 260 }}>
            <Eyebrow accent={accent}>About</Eyebrow>
            <Heading>About {name}</Heading>
            <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.75, whiteSpace: "pre-line" }}>
              {instructor.website_bio ||
                `${name} offers patient, professional driving tuition tailored to every learner — from complete beginners to refresher lessons before your test.`}
            </p>
            {badges.length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
                {badges.map((badge) => (
                  <span
                    key={badge}
                    style={{
                      background: T.iconBg,
                      color: T.primary,
                      border: `1px solid ${T.borderStrong}`,
                      borderRadius: 50,
                      padding: "6px 14px",
                      fontSize: 12,
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
      <section id="courses" style={{ background: T.white, padding: "88px 0", scrollMarginTop: 80 }}>
        <div style={wrap}>
          <Eyebrow accent={accent}>Courses &amp; packages</Eyebrow>
          <Heading>Choose your course</Heading>
          {courses.length === 0 ? (
            <p style={{ fontSize: 16, color: T.muted }}>
              Contact {instructor.name || name} to discuss available courses.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 22 }}>
              {courses.map((course) => {
                const startDate = formatDate(course.start_date || course.available_from);
                return (
                  <article
                    key={course.id}
                    style={{
                      background: T.white,
                      borderRadius: 18,
                      padding: 26,
                      border: `1px solid ${T.border}`,
                      boxShadow: CARD_SHADOW_ED,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: alpha(accent, 0.12),
                          color: accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Car size={20} />
                      </span>
                      <h3
                        style={{
                          fontFamily: FONT_HEADING,
                          fontSize: 17,
                          fontWeight: 700,
                          color: T.navy,
                          flex: 1,
                        }}
                      >
                        {course.name || course.course_type || "Driving course"}
                      </h3>
                      {course.price != null ? (
                        <span
                          style={{
                            fontFamily: FONT_HEADING,
                            fontSize: 20,
                            fontWeight: 800,
                            color: accent,
                            whiteSpace: "nowrap",
                          }}
                        >
                          £{course.price}
                        </span>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
                      {course.total_hours != null ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            color: T.muted,
                            fontWeight: 600,
                          }}
                        >
                          <Clock size={14} /> {course.total_hours} hours
                        </span>
                      ) : null}
                      {startDate ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            color: T.muted,
                            fontWeight: 600,
                          }}
                        >
                          <CalendarDays size={14} /> Starts {startDate}
                        </span>
                      ) : null}
                      {course.transmission ? (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: T.teal,
                            background: "#EAF6F8",
                            borderRadius: 50,
                            padding: "4px 11px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {course.transmission}
                        </span>
                      ) : null}
                    </div>
                    {course.description ? (
                      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65 }}>{course.description}</p>
                    ) : null}
                    <button
                      onClick={() => goEnquire(course.name || course.course_type || "")}
                      style={{
                        marginTop: "auto",
                        width: "100%",
                        background: accent,
                        color: T.white,
                        border: "none",
                        borderRadius: 12,
                        padding: 13,
                        fontSize: 14,
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
        <section id="reviews" style={{ background: T.surface, padding: "88px 0", scrollMarginTop: 80 }}>
          <div style={wrap}>
            <Eyebrow accent={accent}>Reviews</Eyebrow>
            <Heading>What pupils say</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 18 }}>
              {reviews.map((review) => (
                <article
                  key={review.id}
                  style={{
                    background: T.white,
                    borderRadius: 16,
                    padding: 24,
                    border: `1px solid ${T.border}`,
                    boxShadow: CARD_SHADOW_SOFT,
                  }}
                >
                  <Stars count={review.rating ?? 5} color={accent} />
                  <p
                    style={{
                      fontSize: 16,
                      color: T.navy,
                      lineHeight: 1.65,
                      margin: "12px 0 16px",
                    }}
                  >
                    “{review.review_text}”
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.navy }}>
                    {review.pupil_name || "Pupil"}
                  </p>
                  <p style={{ fontSize: 11, color: "#9CA3AF" }}>{formatDate(review.created_at)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* 7. Enquiry */}
      <section id="enquiry" style={{ background: T.white, padding: "88px 0", scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <Eyebrow accent={accent}>Get in touch</Eyebrow>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: 700,
              color: T.navy,
              marginBottom: 10,
            }}
          >
            Send {name} a message
          </h2>
          <p style={{ fontSize: 16, color: T.muted, marginBottom: 30 }}>
            They'll be in touch within 24 hours.
          </p>
          <EnquiryForm
            instructor={instructor}
            accent={accent}
            courseInterest={courseInterest}
            onCourseInterestChange={setCourseInterest}
          />
        </div>
      </section>

      {/* 8. Footer */}
      <footer style={{ background: T.navy, padding: "52px 24px 34px", textAlign: "center" }}>
        <p style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 800, color: T.white }}>{name}</p>
        <nav style={{ display: "flex", gap: 22, justifyContent: "center", flexWrap: "wrap", margin: "20px 0" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToId(link.id)}
              style={{
                fontSize: 14,
                fontWeight: 600,
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
            style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", textDecoration: "none", fontWeight: 600 }}
          >
            {instructor.phone}
          </a>
        ) : null}
        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "26px auto 16px", maxWidth: 440 }} />
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