import type { ReactNode } from "react";
import Badge from "./Badge";
import { useTranslation } from "react-i18next";

type RiskCardProps = {
  title: string;
  description: string;
  activeRisk?: boolean;
  icon: ReactNode;
};

const RiskCard = ({ title, description, activeRisk, icon }: RiskCardProps) => {
  const { t } = useTranslation();
  const hasRisk = Boolean(activeRisk);

  return (
    <div className="rounded-xl border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[var(--b1)]">{icon}</span>
          <h4 className="text-sm font-semibold text-[var(--b1)]">{title}</h4>
        </div>
        <Badge variant={hasRisk ? "danger" : "success"}>
          {hasRisk ? t("propertyPreview.labels.activeRisk") : t("propertyPreview.labels.noRisk")}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
};

export default RiskCard;
