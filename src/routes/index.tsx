import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { CARD_SHADOW, DEFAULT_ACCENT, displayName, type Instructor } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Find your driving instructor — DSM Sites" },
      {
        name: "description",
        content:
          "Search local approved driving instructors by postcode and book lessons directly on their booking site.",
      },
      { property: "og:title", content: "Find your driving instructor — DSM Sites" },
      {
        property: "og:description",
        content: "Search local approved driving instructors by postcode and enquire in seconds.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Instructor[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setLoading(true);
    const { data } = await supabase
      .from("instructors_public")
      .select("*")
      .or(`postcode.ilike.%${term}%,city.ilike.%${term}%`)
      .not("app_slug", "is", null)
      .limit(20);
    setResults((data as Instructor[] | null) ?? []);
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#F8F9FB",
        fontFamily: "Poppins, system-ui, sans-serif",
        color: "#0B1F3A",
        padding: "80px 24px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: DEFAULT_ACCENT,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          DSM Sites
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-0.02em", marginTop: 8 }}>
          Find your instructor
        </h1>
        <p style={{ fontSize: 15, color: "#6B7686", marginTop: 10 }}>
          Enter your postcode or town to see driving instructors near you.
        </p>

        <form onSubmit={search} style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. SW1A or Manchester"
            maxLength={60}
            style={{
              flex: 1,
              padding: "14px 16px",
              fontSize: 15,
              fontFamily: "inherit",
              background: "#fff",
              border: "1px solid #E4E8EF",
              borderRadius: 16,
              outline: "none",
              color: "#0B1F3A",
            }}
          />
          <button
            type="submit"
            style={{
              background: DEFAULT_ACCENT,
              color: "#fff",
              border: "none",
              borderRadius: 50,
              padding: "0 26px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        <div style={{ marginTop: 28, display: "grid", gap: 12, textAlign: "left" }}>
          {loading ? <p style={{ fontSize: 14, color: "#6B7686" }}>Searching…</p> : null}
          {!loading && results?.length === 0 ? (
            <p style={{ fontSize: 14, color: "#6B7686" }}>No instructors found for “{query}”. Try a nearby town.</p>
          ) : null}
          {results?.map((instructor) => (
            <Link
              key={instructor.id}
              to="/$slug"
              params={{ slug: String(instructor.app_slug) }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "#fff",
                borderRadius: 20,
                padding: 16,
                boxShadow: CARD_SHADOW,
                textDecoration: "none",
                color: "#0B1F3A",
              }}
            >
              {instructor.profile_image_url ? (
                <img
                  src={instructor.profile_image_url}
                  alt=""
                  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                />
              ) : null}
              <span>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>{displayName(instructor)}</span>
                <span style={{ display: "block", fontSize: 12, color: "#6B7686" }}>
                  {[instructor.city, instructor.postcode].filter(Boolean).join(" · ")}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
