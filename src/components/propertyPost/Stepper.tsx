import { memo } from "react";
import { POST_PROPERTY_STEPS } from "./stepConfig";
import { Check } from "lucide-react";
import { Button } from "@/components/common";
import { useTranslation } from "react-i18next";

type StepStatus = "done" | "current" | "todo";

export default memo(function Stepper({
  activePath,
  completionPercent,
  stepStatuses,
  onNavigate,
}: {
  activePath: string;
  completionPercent: number;
  stepStatuses: Record<string, StepStatus>;
  onNavigate: (path: string) => void;
}) {
  const { t } = useTranslation();
  const activeIndex = Math.max(
    0,
    POST_PROPERTY_STEPS.findIndex((s) => s.path === activePath)
  );
  const safeCompletion = Math.min(100, Math.max(0, completionPercent));
  const ringSize = 40;
  const ringStroke = 3.5;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (safeCompletion / 100) * ringCircumference;

  return (
    <aside className="w-full lg:w-[236px] shrink-0">
      <div className="glass-card border border-white/50 shadow-lg">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-semibold text-[var(--b1)]">{t("postProperty.stepper.title")}</p>
            <p className="mt-0.5 text-[9px] text-[var(--muted)]">
              {t("postProperty.stepper.subtitle")}
            </p>
          </div>
          <div className="text-right">
            <div className="ml-auto relative h-10 w-10">
              <svg
                className="-rotate-90 h-10 w-10"
                viewBox={`0 0 ${ringSize} ${ringSize}`}
                aria-hidden="true"
              >
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringRadius}
                  fill="none"
                  stroke="rgba(45,106,79,0.2)"
                  strokeWidth={ringStroke}
                />
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringRadius}
                  fill="none"
                  stroke="var(--b1-mid)"
                  strokeWidth={ringStroke}
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <p className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[var(--b1-mid)]">
                {safeCompletion}%
              </p>
            </div>
            <p className="mt-1 text-[9px] text-[var(--muted)]">
              {t("postProperty.stepper.stepCount", {
                current: activeIndex + 1,
                total: POST_PROPERTY_STEPS.length,
              })}
            </p>
          </div>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-white/50 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${safeCompletion}%`,
              background:
                "linear-gradient(90deg, var(--b1-mid), var(--b2), var(--b1-mid))",
            }}
          />
        </div>

        <div className="mt-4 relative">
          {/* Gradient rail */}
          <div
            className="absolute left-[5px] top-1 bottom-1 w-[2px] rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(45,106,79,0.12), rgba(149,213,178,0.95), rgba(45,106,79,0.12))",
            }}
          />

          <ul className="space-y-2 ml-3">
            {POST_PROPERTY_STEPS.map((step, index) => {
              const status = stepStatuses[step.key] ?? "todo";
              const isActive = activePath === step.path;
              const isLocked = status === "todo" && index > activeIndex;
              const canNavigate = !isLocked && status !== "todo";
              const clickable = !isLocked && (status === "done" || isActive);

              const ring =
                status === "done"
                  ? "ring-2 ring-[var(--b2)]/70"
                  : isActive
                  ? "ring-2 ring-[var(--b1-mid)] ring-offset-2 ring-offset-white/50"
                  : "ring-1 ring-[var(--b2)]/40";

              const circleBg =
                status === "done"
                  ? "bg-[var(--b1-mid)] text-[var(--fg)]"
                  : isActive
                  ? "bg-[var(--b2)] text-[var(--b1)]"
                  : "bg-white/70 text-[var(--b1-mid)]";

              return (
                <li key={step.key}>
                  <Button
                    type="button"
                    onClick={() => {
                      if (clickable) onNavigate(step.path);
                    }}
                    disabled={!clickable}
                    className={`group w-full rounded-xl border px-2.5 py-2 text-left transition ${
                      isActive
                        ? "border-[var(--b1-mid)] bg-white/70 shadow-sm"
                        : "border-white/50 bg-white/55 hover:bg-white/70"
                    } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                    title={
                      isLocked
                        ? t("postProperty.stepper.completePrevious")
                        : canNavigate
                        ? t("postProperty.stepper.openStep")
                        : t("postProperty.stepper.completeToUnlock")
                    }
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="relative">
                        <div
                          className={`h-5 w-5 rounded-full flex items-center justify-center ${circleBg} ${ring}`}
                        >
                          {status === "done" ? (
                            <Check size={11} />
                          ) : (
                            <span className="text-[9px] font-bold">{index + 1}</span>
                          )}
                        </div>
                        {isActive && (
                          <div
                            className="absolute -inset-1.5 rounded-full blur-md opacity-70"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(149,213,178,0.8), rgba(149,213,178,0) 70%)",
                            }}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isActive
                              ? "text-[var(--b1)]"
                              : status === "done"
                              ? "text-[var(--b1-mid)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {t(`postProperty.steps.${step.key}`)}
                        </p>
                        <p className="mt-0.5 text-[9px] text-[var(--muted)]">
                          {t("postProperty.stepper.stepLabel", { index: index + 1 })}
                          {status === "done"
                            ? ` • ${t("postProperty.stepper.completed")}`
                            : isActive
                            ? ` • ${t("postProperty.stepper.inProgress")}`
                            : isLocked
                            ? ` • ${t("postProperty.stepper.locked")}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
});

