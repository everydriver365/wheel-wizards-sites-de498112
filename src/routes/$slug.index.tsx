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
  const { data: instructor, error } = await supabase
    .from("instructors_public")
    .select("*")
    .eq("app_slug", slug)
    .single();

  if (error || !instructor) return { instructor: null, courses: [], reviews: [] };

  const [{ data: courses }, { data: reviews }] = await Promise.all([
    supabase
      .from("instructor_courses")
      .select(
        "id, course_type, name, total_hours, price, start_date, image_url, course_image_url, description, available_from",
      )
      .eq("instructor_id", instructor.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("reviews")
      .select("id, pupil_name, rating, review_text, created_at")
      .eq("instructor_id", instructor.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return {
    instructor: instructor as Instructor,
    courses: (courses as Course[] | null) ?? [],
    reviews: (reviews as Review[] | null) ?? [],
  };
}

function InstructorPage() {
  const { slug } = Route.useParams();
  const { data, isPending } = useQuery({
    queryKey: ["instructor-site", slug],
    queryFn: () => loadSite(slug),
  });

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

  return <InstructorSite instructor={data.instructor} courses={data.courses} reviews={data.reviews} />;
}