import { PhoneCall, ShieldCheck } from "lucide-react";
import type { Property } from "../../features/properties/propertyType";
import { Button } from "@/components/common";
import { getPrimaryContact } from "./previewUtils";
import { useTranslation } from "react-i18next";

type AgentCardProps = {
  property: Property;
};

const AgentCard = ({ property }: AgentCardProps) => {
  const { t } = useTranslation();
  const { agentName, phone, role, verified } = getPrimaryContact(property);
  const contactNumber = phone || "\u2014";

  return (
    <div className="rounded-2xl border border-[var(--b2-soft)] bg-white p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--b1)]">{t("propertyPreview.sections.agentContact")}</h3>
      <p className="mt-3 text-base font-semibold text-[var(--b1)]">{agentName}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{role}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{contactNumber}</p>

      {verified && (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck size={12} />
          {t("propertyPreview.labels.verified")}
        </span>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2">
        <Button
          className="w-full gap-2 bg-[var(--b1)] text-[var(--fg)] hover:bg-[var(--b1-mid)]"
          onClick={() => {
            if (phone) {
              window.location.href = `tel:${phone}`;
            }
          }}
          disabled={!phone}
        >
          <PhoneCall size={14} className="shrink-0" aria-hidden />
          {t("propertyPreview.actions.call")}
        </Button>
        <Button
          className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => {
            if (phone) {
              window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
            }
          }}
          disabled={!phone}
        >
          {t("propertyPreview.actions.contact")}
        </Button>
      </div>
    </div>
  );
};

export default AgentCard;
