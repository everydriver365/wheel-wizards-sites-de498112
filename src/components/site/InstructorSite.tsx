import { useEffect, useMemo, useState } from "react";
import { Clock, CalendarDays, Car, Star, Check, Quote } from "lucide-react";

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

const sectionHead: React.CSSProperties = { textAlign: "center", maxWidth: 660, margin: "0 auto 44px" };

function SectionLead({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.65 }}>{children}</p>;
}

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

  const gallery = useMemo<string[]>(() => {
    const raw = instructor.website_gallery_urls;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
    try {
      const parsed = JSON.parse(String(raw));
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
    } catch {
      return [];
    }
  }, [instructor.website_gallery_urls]);

  const stats = [
    reviews.length ? { value: `${reviews.length}+`, label: "Happy pupils" } : null,
    { value: instructor.dvsa_grade || "ADI", label: "DVSA grade" },
    { value: instructor.dvsa_type || "Qualified", label: "Licence type" },
    courses.length ? { value: `${courses.length}`, label: "Courses" } : null,
    { value: instructor.dbs_uploaded ? "DBS" : "Vetted", label: "Background check" },
  ].filter(Boolean) as { value: string; label: string }[];

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
      {/* 1. Sticky nav — EveryDriver style: always visible, white, wordmark + links + two CTAs */}
      <header
        style={{
          position: "sticky",
          top: 0,
          height: 80,
          background: T.white,
          borderBottom: `1px solid ${T.navBorder}`,
          zIndex: 50,
          boxShadow: scrolled ? "0 6px 20px rgba(12,35,64,0.06)" : "none",
          transition: "box-shadow 220ms ease",
        }}
      >
        <div
          style={{
            ...wrap,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {instructor.profile_image_url ? (
              <img
                src={instructor.profile_image_url}
                alt={name}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${T.iconBg}`,
                }}
              />
            ) : null}
            <span
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 18,
                fontWeight: 800,
                color: T.navy,
                letterSpacing: "-0.01em",
              }}
            >
              {name}
            </span>
          </div>
          <nav className="hidden lg:flex" style={{ gap: 34, alignItems: "center" }}>
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToId(link.id)}
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: T.navy,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => scrollToId("courses")}
              className="hidden sm:block"
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
              Find a course
            </button>
            <button
              onClick={() => goEnquire()}
              style={{
                background: T.white,
                color: accent,
                borderRadius: 10,
                padding: "10px 20px",
                border: `1.5px solid ${accent}`,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Book now
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero — EveryDriver split layout: light surface, blobs, copy left, tilted cards right */}
      <section
        style={{
          position: "relative",
          padding: "72px 0 88px",
          overflow: "hidden",
          background: T.surface,
        }}
      >
        {/* soft background blobs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: alpha(accent, 0.07),
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -180,
            left: -140,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: alpha(T.teal, 0.08),
          }}
        />

        <div
          className="grid lg:grid-cols-2"
          style={{ ...wrap, position: "relative", gap: 48, alignItems: "center" }}
        >
          {/* left: copy */}
          <div>
            <Eyebrow accent={accent}>{name}</Eyebrow>
            <h1
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(34px, 4.6vw, 58px)",
                fontWeight: 800,
                color: T.navy,
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                marginBottom: 18,
              }}
            >
              Driving lessons in{" "}
              <span style={{ color: accent }}>{instructor.city || "your area"}</span>
            </h1>
            <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.65, maxWidth: 480 }}>
              DVSA-approved tuition, flexible hours and a pass-first-time plan built around you.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              <button
                onClick={() => goEnquire()}
                style={{
                  background: accent,
                  color: T.white,
                  padding: "15px 30px",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: `0 10px 24px ${alpha(accent, 0.28)}`,
                }}
              >
                Book a lesson
              </button>
              <button
                onClick={() => scrollToId("courses")}
                style={{
                  background: T.white,
                  color: accent,
                  padding: "15px 30px",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 700,
                  border: `1.5px solid ${alpha(accent, 0.35)}`,
                  cursor: "pointer",
                }}
              >
                See courses →
              </button>
            </div>

            {/* rating + trust row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginTop: 30,
                fontSize: 14,
                color: T.muted,
                fontWeight: 600,
              }}
            >
              {reviews.length > 0 ? (
                <>
                  <Stars count={5} color="#F4B740" />
                  <strong style={{ color: T.navy }}>{avgRating} average</strong>
                  <span>· Rated by {reviews.length}+ learners</span>
                </>
              ) : null}
              {badges.length ? (
                <>
                  {reviews.length > 0 ? <span style={{ color: T.borderStrong }}>|</span> : null}
                  {badges.map((badge) => (
                    <span
                      key={badge}
                      style={{
                        background: T.white,
                        color: accent,
                        border: `1px solid ${T.borderStrong}`,
                        borderRadius: 8,
                        padding: "5px 10px",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </>
              ) : null}
            </div>
          </div>

          {/* right: tilted image cards */}
          <div style={{ position: "relative", minHeight: 420 }}>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "6% 4% 14% 12%",
                borderRadius: 28,
                background: alpha(T.teal, 0.35),
                transform: "rotate(4deg)",
              }}
            />
            {heroImage ? (
              <img
                src={heroImage}
                alt={`Driving lessons with ${name}`}
                style={{
                  position: "absolute",
                  inset: "0% 8% 18% 0%",
                  width: "92%",
                  height: "82%",
                  objectFit: "cover",
                  borderRadius: 22,
                  transform: "rotate(-3deg)",
                  border: `8px solid ${T.white}`,
                  boxShadow: "0 26px 60px rgba(12,35,64,0.20)",
                }}
              />
            ) : null}
            {instructor.profile_image_url ? (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: T.white,
                  borderRadius: 16,
                  padding: "12px 18px 12px 12px",
                  boxShadow: CARD_SHADOW_ED,
                }}
              >
                <img
                  src={instructor.profile_image_url}
                  alt={name}
                  style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <p style={{ fontFamily: FONT_HEADING, fontWeight: 800, fontSize: 15 }}>{name}</p>
                  <p
                    style={{
                      fontSize: 12,
                      color: T.muted,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Stars count={5} color="#F4B740" />
                    {avgRating || "5.0"} · {instructor.dbs_uploaded ? "DBS checked" : "DVSA approved"}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 3. Stats bar */}
      <section style={{ background: T.white, padding: "30px 0", borderBottom: `1px solid ${T.navBorder}` }}>
        <div
          style={{
            ...wrap,
            display: "grid",
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
          }}
        >
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
      {gallery.length > 0 ? (
        <section id="gallery" style={{ background: T.white, padding: "72px 0", scrollMarginTop: 80 }}>
          <div style={wrap}>
            <Eyebrow accent={accent}>Gallery</Eyebrow>
            <Heading>A look at lessons with {name}</Heading>
            <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 14 }}>
              {gallery.map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={`${name} driving school photo ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    borderRadius: 16,
                    border: `1px solid ${T.border}`,
                    boxShadow: CARD_SHADOW_SOFT,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

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