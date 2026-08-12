import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Quote, Star } from "lucide-react";

import MiniSiteNav from "@/components/site/MiniSiteNav";
import MiniSitePageHeader from "@/components/site/MiniSitePageHeader";
import { supabase } from "@/lib/supabase";
import { DEFAULT_ACCENT, alpha, formatDate, type Instructor, type Review } from "@/lib/site";

export const Route = createFileRoute("/$slug/reviews")({
  head: () => ({
    meta: [
      { title: "Pupil reviews — DSM Sites" },
      { name: "description", content: "Read verified reviews from pupils who learned to drive with this instructor." },
      { property: "og:title", content: "Pupil reviews" },
      { property: "og:description", content: "Read verified reviews from pupils who learned to drive with this instructor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";

async function loadReviews(slug: string) {
  const { data: instructor } = await supabase
    .from("instructors_public")
    .select("*")
    .eq("app_slug", slug)
    .single();
  if (!instructor) return { instructor: null, reviews: [] as Review[] };

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, pupil_name, rating, review_text, created_at")
    .eq("instructor_id", instructor.id)
    .order("created_at", { ascending: false });

  return { instructor: instructor as Instructor, reviews: (reviews as Review[] | null) ?? [] };
}

function Stars({ count = 5, color }: { count?: number; color: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={14} strokeWidth={0} fill={index < Math.round(count) ? color : "#D8E1EC"} />
      ))}
    </span>
  );
}

function ReviewsPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery({ queryKey: ["mini-reviews", slug], queryFn: () => loadReviews(slug) });
  const instructor = data?.instructor ?? null;
  const accent = instructor?.brand_colour || DEFAULT_ACCENT;
  const reviews = data?.reviews ?? [];
  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating ?? 5), 0) / reviews.length
    : 0;

  return (
    <div style={{ fontFamily: FONT, background: "#F8F9FB", minHeight: "100dvh" }}>
      <MiniSiteNav instructor={instructor} slug={slug} accent={accent} active="/reviews" />
      <div style={{ height: 60 }} />
      <MiniSitePageHeader
        label="Reviews"
        title="What pupils say"
        background={instructor?.brand_colour || "#0B1F3A"}
        subtitle={
          reviews.length ? (
            <span>
              {avg.toFixed(1)} average from {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          ) : null
        }
      />
      <main style={{ background: "#F8F9FB", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {reviews.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6B7686", fontSize: 15 }}>No reviews yet.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {reviews.map((review) => (
                <article
                  key={review.id}
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: 24,
                    border: "1px solid #E4E8EF",
                    boxShadow: "0 1px 3px rgba(11,31,58,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <Quote size={26} color={alpha(accent, 0.22)} fill={alpha(accent, 0.22)} strokeWidth={0} />
                  <Stars count={review.rating ?? 5} color={accent} />
                  <p style={{ fontSize: 15, color: "#0B1F3A", lineHeight: 1.7, flex: 1 }}>{review.review_text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 4 }}>
                    <span
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 999,
                        background: alpha(accent, 0.12),
                        color: accent,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {(review.pupil_name || "P").trim().charAt(0).toUpperCase()}
                    </span>
                    <span>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: "#0B1F3A" }}>
                        {review.pupil_name || "Pupil"}
                      </span>
                      <span style={{ display: "block", fontSize: 11.5, color: "#9CA3AF" }}>
                        {formatDate(review.created_at)}
                      </span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
