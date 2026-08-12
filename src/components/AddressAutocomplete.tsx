import { useEffect, useRef } from "react";

const GOOGLE_MAPS_SRC =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyDWFw0oL9ZyhwdvdvYtDsdJrTFYzF0khFc&libraries=places";

/** Loads the Google Maps Places script once per page. */
function ensureGoogleMaps() {
  if (typeof document === "undefined") return;
  if (document.getElementById("google-maps-script")) return;
  const script = document.createElement("script");
  script.id = "google-maps-script";
  script.src = GOOGLE_MAPS_SRC;
  script.async = true;
  document.head.appendChild(script);
}

function AddressAutocompleteField({ label, value, onChange, onPostcodeExtracted, placeholder, style }: { label: string; value: string; onChange: (v: string) => void; onPostcodeExtracted: (pc: string) => void; placeholder?: string; style?: React.CSSProperties }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const attachedRef = useRef(false);

  useEffect(() => {
    if (attachedRef.current) return;
    ensureGoogleMaps();
    let cancelled = false;
    const tryAttach = () => {
      if (cancelled || attachedRef.current) return;
      const g = (window as any).google;
      if (!g?.maps?.places?.Autocomplete || !inputRef.current) {
        setTimeout(tryAttach, 200);
        return;
      }
      attachedRef.current = true;
      const ac = new g.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "gb" },
        types: ["address"],
      });
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        const formatted = place?.formatted_address || inputRef.current?.value || "";
        onChange(formatted);
        const comps = place?.address_components || [];
        const pc = comps.find((c: any) => c.types?.includes("postal_code"));
        if (pc?.long_name) onPostcodeExtracted(pc.long_name);
      });
    };
    tryAttach();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <label style={{ display: "block" }}>
      {label ? (
        <div style={{ fontSize: 13, color: "#5A6B82", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      ) : null}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        style={{ width: "100%", padding: "12px 14px", border: "1px solid #E2E6ED", borderRadius: 10, fontSize: 15, color: "#0C2340", ...style }}
      />
    </label>
  );
}

export { AddressAutocompleteField };
export default AddressAutocompleteField;
