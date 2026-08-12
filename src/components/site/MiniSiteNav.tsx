import type { Instructor } from "@/lib/site";

const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";

const LINKS = [
  { label: "Home", path: "" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Reviews", path: "/reviews" },
  { label: "Contact", path: "/enquire" },
];

export default function MiniSiteNav({
  instructor,
  slug,
  accent,
  active,
}: {
  instructor: Instructor | null;
  slug: string;
  accent: string;
  active?: "" | "/about" | "/courses" | "/reviews" | "/enquire";
}) {
  const logo = instructor?.["logo_url"] ? String(instructor["logo_url"]) : null;
  const name = instructor?.trading_name ?? instructor?.name ?? "";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "#fff",
        borderBottom: "1px solid #E4E8EF",
        boxShadow: "0 2px 8px rgba(11,31,58,0.08)",
        height: 60,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: FONT,
      }}
    >
      <a href={`/${slug}`} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        {logo ? (
          <img src={logo} alt={name} style={{ height: 40, maxWidth: 170, objectFit: "contain" }} />
        ) : (
          <>
            {instructor?.profile_image_url ? (
              <img
                src={instructor.profile_image_url}
                alt={name}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `2px solid ${accent}`,
                }}
              />
            ) : null}
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0B1F3A" }}>{name}</span>
          </>
        )}
      </a>

      <nav className="hidden md:flex" style={{ gap: 28, alignItems: "center" }}>
        {LINKS.map((link) => {
          const isActive = active === link.path;
          return (
            <a
              key={link.label}
              href={`/${slug}${link.path}`}
              style={{
                fontSize: 14,
                color: isActive ? accent : "#6B7686",
                textDecoration: "none",
                fontFamily: FONT,
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <a
        href={`/${slug}/enquire`}
        style={{
          background: accent,
          color: "#fff",
          borderRadius: 50,
          padding: "8px 20px",
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          fontFamily: FONT,
          flexShrink: 0,
        }}
      >
        Book now
      </a>
    </header>
  );
}
