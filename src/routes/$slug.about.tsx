import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import MiniSiteNav from "@/components/site/MiniSiteNav";
import MiniSitePageHeader from "@/components/site/MiniSitePageHeader";
import { supabase } from "@/lib/supabase";
import { DEFAULT_ACCENT, alpha, displayName, type Instructor } from "@/lib/site";

export const Route = createFileRoute("/$slug/about")({
  head: () => ({
    meta: [
      { title: "About your driving instructor — DSM Sites" },
      { name: "description", content: "Meet your driving instructor: experience, DVSA qualifications, tuition vehicle and photos." },
      { property: "og:title", content: "About your driving instructor" },
      { property: "og:description", content: "Meet your driving instructor: experience, DVSA qualifications, tuition vehicle and photos." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";

async function loadInstructor(slug: string) {
  const { data } = await supabase.from("instructors_public").select("*").eq("app_slug", slug).single();
  return (data as Instructor | null) ?? null;
}

function parseGallery(value: Instructor["website_gallery_urls"]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function Badge({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: alpha(accent, 0.1),
        color: accent,
        borderRadius: 50,
        padding: "6px 14px",
        fontSize: 12.5,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function AboutPage() {
  const { slug } = Route.useParams();
  const { data: instructor } = useQuery({ queryKey: ["mini-about", slug], queryFn: () => loadInstructor(slug) });
  const accent = instructor?.brand_colour || DEFAULT_ACCENT;
  const gallery = parseGallery(instructor?.website_gallery_urls ?? null);

  const vehicleMake = instructor?.["vehicle_make"] ? String(instructor["vehicle_make"]) : null;
  const vehicleModel = instructor?.["vehicle_model"] ? String(instructor["vehicle_model"]) : null;
  const carType = instructor?.["car_type"] ? String(instructor["car_type"]) : null;
  const vehicleImage =
    (instructor?.["vehicle_image_url"] as string | undefined) ??
    (instructor?.["car_image_url"] as string | undefined) ??
    null;

  return (
    <div style={{ fontFamily: FONT, background: "#F8F9FB", minHeight: "100dvh" }}>
      <MiniSiteNav instructor={instructor ?? null} slug={slug} accent={accent} active="/about" />
      <div style={{ height: 60 }} />
      <MiniSitePageHeader
        label="About"
        title={instructor ? displayName(instructor) : "About"}
        background={instructor?.brand_colour || "#0B1F3A"}
      />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 72px" }}>
        <div className="flex flex-col md:flex-row" style={{ gap: 32, alignItems: "flex-start" }}>
          {instructor?.profile_image_url ? (
            <img
              src={instructor.profile_image_url}
              alt={instructor ? displayName(instructor) : ""}
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                objectFit: "cover",
                border: `4px solid ${accent}`,
                flexShrink: 0,
              }}
            />
          ) : null}
          <div style={{ flex: 1 }}>
            {instructor?.website_bio ? (
              <p style={{ fontSize: 16, lineHeight: 1.75, color: "#334155", whiteSpace: "pre-line" }}>
                {instructor.website_bio}
              </p>
            ) : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
              {instructor?.dvsa_type ? <Badge accent={accent}>{instructor.dvsa_type}</Badge> : null}
              {instructor?.dvsa_grade ? <Badge accent={accent}>DVSA Grade {instructor.dvsa_grade}</Badge> : null}
              {instructor?.dbs_uploaded ? <Badge accent={accent}>DBS checked</Badge> : null}
            </div>
          </div>
        </div>

        {vehicleMake || vehicleModel || carType ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              marginTop: 32,
              border: "1px solid #E4E8EF",
              boxShadow: "0 1px 3px rgba(11,31,58,0.06)",
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0B1F3A" }}>
              Teaching in a {[vehicleMake, vehicleModel].filter(Boolean).join(" ")}
              {carType ? ` (${carType})` : ""}
            </p>
            {vehicleImage ? (
              <img
                src={vehicleImage}
                alt="Tuition vehicle"
                style={{ width: "100%", borderRadius: 12, marginTop: 14, objectFit: "cover" }}
              />
            ) : null}
          </div>
        ) : null}

        {gallery.length > 0 ? (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0B1F3A", marginBottom: 16 }}>Gallery</h2>
            <div style={{ columns: "2 200px", columnGap: 14 }}>
              {gallery.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="Driving lesson"
                  loading="lazy"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    marginBottom: 14,
                    display: "block",
                    breakInside: "avoid",
                  }}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
