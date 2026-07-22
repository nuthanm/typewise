import {
  VERIFICATION_LABELS,
  type VerificationStatus,
} from "@/lib/companies";

type VerificationStatusTagProps = {
  status: VerificationStatus;
  size?: "sm" | "md";
};

export function VerificationStatusTag({ status, size = "md" }: VerificationStatusTagProps) {
  const label = VERIFICATION_LABELS[status];
  const className = `status-tag status-tag-${status.replace("_", "-")} status-tag-${size}`;

  return (
    <span className={className} title={label}>
      {status === "verified" && (
        <span className="status-tag-icon" aria-hidden="true">
          ✓
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}
