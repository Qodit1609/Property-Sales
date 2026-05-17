import React from "react";
import { useTranslation } from "react-i18next";
import { Clock3 } from "lucide-react";
import { useAppSelector } from "../../hooks/reduxHooks";

const activityTypeKey = (type: string) => `buyerPanel.activity.types.${type}`;

const ActivityHistory: React.FC = () => {
  const { t } = useTranslation();
  const { activity } = useAppSelector((state) => state.buyer);

  if (activity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-8 py-16 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--b1)]">
          {t("buyerPanel.activity.emptyTitle")}
        </h2>
        <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
          {t("buyerPanel.activity.emptyBody")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)]">
          <Clock3 className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[var(--b1)]">
            {t("buyerPanel.activity.title")}
          </h2>
          <p className="text-[11px] text-[var(--muted)]">
            {t("buyerPanel.activity.touchpoints", {
              count: Math.min(activity.length, 20),
            })}
          </p>
        </div>
      </div>

      <div className="mt-2 space-y-2 text-xs text-[var(--b1)]">
        {activity.slice(0, 20).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-[var(--b2-soft)] bg-[var(--b2-soft)] px-3 py-2"
          >
            <div className="mt-0.5 h-8 w-0.5 rounded-full bg-gradient-to-b from-emerald-400 to-sky-500" />
            <div className="flex-1">
              <p className="text-[11px] font-medium text-[var(--b1)]">
                {t(activityTypeKey(item.type), { defaultValue: item.type })}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--muted)] line-clamp-1">
                {item.title}
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--muted)]/80">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistory;
