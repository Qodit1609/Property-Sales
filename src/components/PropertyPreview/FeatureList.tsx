import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type FeatureItem = {
  label: string;
  enabled?: boolean;
};

type FeatureListProps = {
  items: FeatureItem[];
  emptyMessage?: string;
};

const FeatureList = ({ items, emptyMessage }: FeatureListProps) => {
  const { t } = useTranslation();
  const resolvedEmptyMessage = emptyMessage ?? t("propertyPreview.messages.noDataAvailable");

  if (!items.length) {
    return <p className="text-sm text-[var(--muted)]">{resolvedEmptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const isEnabled = Boolean(item.enabled);
        return (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 px-3 py-2 text-sm font-medium text-[var(--b1)]"
          >
            {isEnabled ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <XCircle size={16} className="text-rose-500" />
            )}
            <span className="flex-1">{item.label}</span>
            <span className={isEnabled ? "text-emerald-700" : "text-rose-700"}>
              {isEnabled ? t("postProperty.common.yes") : t("postProperty.common.no")}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureList;
