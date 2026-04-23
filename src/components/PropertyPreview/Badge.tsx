type BadgeVariant = "success" | "danger" | "warning" | "neutral";

type BadgeProps = {
  children: string;
  variant?: BadgeVariant;
};

const badgeClassByVariant: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-700",
  warning: "bg-amber-100 text-amber-700",
  neutral: "bg-[var(--b2-soft)] text-[var(--b1)]",
};

const Badge = ({ children, variant = "neutral" }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClassByVariant[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
