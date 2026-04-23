import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type PropertyFeatureListProps = {
  items: Array<{ label: string; value: string }>;
  emptyMessage?: string;
};

const PropertyFeatureList = ({
  items,
  emptyMessage,
}: PropertyFeatureListProps) => {
  const { t } = useTranslation();
  const resolvedEmptyMessage = emptyMessage ?? t("propertyPreview.messages.noDataAvailable");

  if (!items.length) {
    return <p className="text-sm text-[var(--muted)]">{resolvedEmptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 px-3 py-2"
        >
          <p className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <CheckCircle2 size={14} className="text-emerald-600" />
            {item.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--b1)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default PropertyFeatureList;
