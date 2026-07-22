type VerifiedStampProps = {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

export function VerifiedStamp({ size = "md", showLabel = true }: VerifiedStampProps) {
  return (
    <span
      className={`verified-stamp verified-stamp-${size}`}
      title="Manually validated on official company pages"
      aria-label="Typewise verified — manually checked on official company website"
    >
      <span className="verified-stamp-icon" aria-hidden="true">
        ✓
      </span>
      {showLabel && <span className="verified-stamp-label">Verified</span>}
    </span>
  );
}
