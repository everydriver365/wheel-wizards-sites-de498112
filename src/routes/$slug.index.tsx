import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { InstructorSite } from "@/components/site/InstructorSite";
import { supabase } from "@/lib/supabase";
import type { Course, Instructor, Review } from "@/lib/site";

export const Route = createFileRoute("/$slug/")({
  head: ({ params }) => {
    const title = `Driving lessons with ${params.slug.replace(/-/g, " ")} — DSM Sites`;
    const description =
      "Book driving lessons, view courses and prices, read pupil reviews and send an enquiry directly.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: InstructorPage,
});

async function loadSite(slug: string) {
  const today = new Date().toISOString().split("T")[0];
  const { data: instructor, error } = await supabase
    .from("instructors_public")
    .select("*")
    .eq("app_slug", slug)
    .single();

  if (error || !instructor)
    return {
      instructor: null,
      courses: [],
      reviews: [],
      passRate: null as number | null,
      totalTests: 0,
      nextAvailable: null as string | null,
    };

  const [{ data: courses }, { data: reviews }, testRes, { data: nextCourse }] = await Promise.all([
    supabase
      .from("instructor_courses")
      .select(
        "id, course_type, name, total_hours, price, start_date, image_url, description, available_from, early_bird_discount, early_bird_expiry",
      )
      .eq("instructor_id", instructor.id)
      .is("deleted_at", null)
      .or(`available_from.gte.${today},start_date.gte.${today}`)
      .order("image_url", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("reviews")
      .select("id, pupil_name, rating, review_text, created_at")
      .eq("instructor_id", instructor.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("test_results").select("result").eq("instructor_id", instructor.id),
    supabase
      .from("instructor_courses")
      .select("start_date, available_from, name")
      .eq("instructor_id", instructor.id)
      .is("deleted_at", null)
      .gte("start_date", today)
      .order("start_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const testResults = (testRes.error ? null : (testRes.data as { result?: string | null }[] | null)) ?? null;
  const totalTests = testResults?.length ?? 0;
  const passedTests =
    testResults?.filter((t) => t.result === "pass" || t.result === "passed").length ?? 0;
  const passRate = totalTests >= 5 ? Math.round((passedTests / totalTests) * 100) : null;

  const nextAvailable =
    (nextCourse?.available_from as string | null) ?? (nextCourse?.start_date as string | null) ?? null;

  return {
    instructor: instructor as Instructor,
    courses: (courses as Course[] | null) ?? [],
    reviews: (reviews as Review[] | null) ?? [],
    passRate,
    totalTests,
    nextAvailable,
  };
}

/** Sets SEO meta from the loaded instructor record (data is fetched client-side). */
function useInstructorMeta(instructor: Instructor | null) {
  useEffect(() => {
    if (!instructor) return;
    const brand = String(instructor.trading_name ?? instructor.name ?? "Driving instructor");
    const city = instructor.city ? ` in ${instructor.city}` : "";
    const title = `${brand} — Driving Lessons${city}`;
    const description = String(
      instructor.website_bio ??
        `Professional driving lessons with ${brand}${city}. Book online today.`,
    );
    const image = String(instructor.website_hero_image_url ?? instructor.profile_image_url ?? "");

    document.title = title;

    const set = (kind: "name" | "property", key: string, content: string) => {
      if (!content) return;
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${kind}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(kind, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    set("name", "description", description);
    set("property", "og:title", `${brand} — Driving Lessons`);
    set("property", "og:description", String(instructor.website_bio ?? `Book driving lessons with ${brand}`));
    set("property", "og:image", image);
    set("property", "og:type", "website");
    set("name", "twitter:card", "summary_large_image");
    set("name", "twitter:image", image);
  }, [instructor]);
}

function InstructorPage() {
  const { slug } = Route.useParams();
  const { data, isPending } = useQuery({
    queryKey: ["instructor-site", slug],
    queryFn: () => loadSite(slug),
  });

  useInstructorMeta(data?.instructor ?? null);

  if (isPending) {
    return (
      <main
        style={{
          minHeight: "100dvh",
          background: "#0C2340",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Manrope', system-ui, sans-serif",
        }}
      >
        <div
          className="animate-pulse"
          style={{
            width: 240,
            height: 26,
            borderRadius: 50,
            background: "rgba(255,255,255,0.14)",
          }}
        />
      </main>
    );
  }

  if (!data?.instructor) {
    return (
      <main
        style={{
          minHeight: "100dvh",
          background: "#0C2340",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 24,
          fontFamily: "'Manrope', system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff" }}>Instructor not found</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 10, maxWidth: 380 }}>
          This page doesn't exist or has been removed.
        </p>
        <a
          href="https://everydriver.co.uk"
          style={{
            marginTop: 24,
            background: "#1A4A6E",
            color: "#fff",
            borderRadius: 50,
            padding: "12px 26px",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Go to EveryDriver
        </a>
      </main>
    );
  }

  return (
    <InstructorSite
      instructor={data.instructor}
      courses={data.courses}
      reviews={data.reviews}
      passRate={data.passRate}
      totalTests={data.totalTests}
      nextAvailable={data.nextAvailable}
    />
  );
}