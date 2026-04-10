import Badge from "./Badge";
import { useTranslation } from "react-i18next";

type InfoValue = string | number | boolean | null | undefined;

type InfoItemProps = {
  label: string;
  value: InfoValue;
  suffix?: string;
};

const getDisplayValue = (value: InfoValue, suffix: string | undefined, yesText: string, noText: string, naText: string) => {
  if (typeof value === "boolean") {
    return <Badge variant={value ? "success" : "danger"}>{value ? yesText : noText}</Badge>;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value.toLocaleString("en-IN")}${suffix ?? ""}`;
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return naText;
};

const InfoItem = ({ label, value, suffix }: InfoItemProps) => {
  const { t } = useTranslation();
  const displayValue = getDisplayValue(
    value,
    suffix,
    t("postProperty.common.yes"),
    t("postProperty.common.no"),
    t("propertyPreview.labels.notAvailable"),
  );

  return (
    <div className="rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)]/20 px-3 py-2">
      <p className="text-xs text-[var(--muted)]">{label}</p>
      <div className="mt-1 text-sm font-semibold text-[var(--b1)]">{displayValue}</div>
    </div>
  );
};

export default InfoItem;
