import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import IOSCourseCard from "@/components/IOSCourseCard";
import MiniSiteNav from "@/components/site/MiniSiteNav";
import MiniSitePageHeader from "@/components/site/MiniSitePageHeader";
import { supabase } from "@/lib/supabase";
import { DEFAULT_ACCENT, type Course, type Instructor } from "@/lib/site";

export const Route = createFileRoute("/$slug/courses")({
  head: () => ({
    meta: [
      { title: "Driving courses & prices — DSM Sites" },
      { name: "description", content: "Browse every driving course and package on offer, with hours, prices and start dates." },
      { property: "og:title", content: "Driving courses & prices" },
      { property: "og:description", content: "Browse every driving course and package on offer, with hours, prices and start dates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursesPage,
});

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";

async function loadCourses(slug: string) {
  const { data: instructor } = await supabase
    .from("instructors_public")
    .select("*")
    .eq("app_slug", slug)
    .single();
  if (!instructor) return { instructor: null, courses: [] as Course[] };

  const { data: courses } = await supabase
    .from("instructor_courses")
    .select(
      "id, course_type, name, total_hours, price, start_date, image_url, course_image_url, description, available_from, early_bird_discount, early_bird_expiry",
    )
    .eq("instructor_id", instructor.id)
    .is("deleted_at", null)
    .or(
      `available_from.gte.${new Date().toISOString().split("T")[0]},start_date.gte.${new Date().toISOString().split("T")[0]}`,
    )
    .order("image_url", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  return { instructor: instructor as Instructor, courses: (courses as Course[] | null) ?? [] };
}

function CoursesPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery({ queryKey: ["mini-courses", slug], queryFn: () => loadCourses(slug) });
  const instructor = data?.instructor ?? null;
  const accent = instructor?.brand_colour || DEFAULT_ACCENT;
  const courses = data?.courses ?? [];

  const enquireHref = (interest?: string) =>
    `/${slug}/enquire${interest ? `?course=${encodeURIComponent(interest)}` : ""}`;

  return (
    <div style={{ fontFamily: FONT, background: "#F8F9FB", minHeight: "100dvh" }}>
      <MiniSiteNav instructor={instructor} slug={slug} accent={accent} active="/courses" />
      <div style={{ height: 60 }} />
      <MiniSitePageHeader
        label="Courses & packages"
        title="Choose your course"
        background={instructor?.brand_colour || "#0B1F3A"}
      />
      <main style={{ background: "#F8F9FB", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {courses.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6B7686", fontSize: 15 }}>
              No courses listed right now — send an enquiry and we'll be in touch.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {courses.map((course) => (
                <IOSCourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    name: course.name ?? null,
                    course_type: course.course_type ?? null,
                    total_hours: course.total_hours ?? null,
                    price: course.price ?? null,
                    start_date: course.start_date ?? null,
                    available_from: course.available_from ?? null,
                    image_url: course.image_url ?? course.course_image_url ?? null,
                    early_bird_discount: (course as unknown as { early_bird_discount?: number | null }).early_bird_discount ?? null,
                    early_bird_expiry: (course as unknown as { early_bird_expiry?: string | null }).early_bird_expiry ?? null,
                  }}
                  instructor={{
                    name: instructor?.name ?? null,
                    trading_name: instructor?.trading_name ?? null,
                    brand_colour: instructor?.brand_colour ?? null,
                    city: instructor?.city ?? null,
                    postcode: instructor?.postcode ?? null,
                  }}
                  enquireHref={`/${slug}/book?course=${course.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
