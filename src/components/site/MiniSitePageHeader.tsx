const FONT = "'Poppins', 'Manrope', system-ui, sans-serif";

export default function MiniSitePageHeader({
  label,
  title,
  subtitle,
  background,
}: {
  label: string;
  title: string;
  subtitle?: React.ReactNode;
  background: string;
}) {
  return (
    <header style={{ background, padding: "80px 24px 40px", textAlign: "center", fontFamily: FONT }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(255,255,255,0.6)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}
      >
        {label}
      </p>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{title}</h1>
      {subtitle ? (
        <div style={{ marginTop: 12, fontSize: 15, color: "rgba(255,255,255,0.75)" }}>{subtitle}</div>
      ) : null}
    </header>
  );
}
