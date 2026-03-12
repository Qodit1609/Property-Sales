import { memo } from "react";
import { POST_PROPERTY_STEPS } from "./stepConfig";
import { Check } from "lucide-react";

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
  const activeIndex = Math.max(
    0,
    POST_PROPERTY_STEPS.findIndex((s) => s.path === activePath)
  );

  return (
    <aside className="w-full lg:w-[320px] shrink-0">
      <div className="glass-card border border-white/50 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--b1)]">Post a Property</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Complete steps to publish your listing
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[var(--b1-mid)]">
              {completionPercent}%
            </p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              Step   {activeIndex + 1}/{POST_PROPERTY_STEPS.length}
            </p>
          </div>
        </div>

        <div className="mt-4 h-2 w-full rounded-full bg-white/50 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${completionPercent}%`,
              background:
                "linear-gradient(90deg, var(--b1-mid), var(--b2), var(--b1-mid))",
            }}
          />
        </div>

        <div className="mt-6 relative">
          {/* Gradient rail */}
          <div
            className="absolute left-[6px] top-1 bottom-1 w-[3px] rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(45,106,79,0.12), rgba(149,213,178,0.95), rgba(45,106,79,0.12))",
            }}
          />

          <ul className="space-y-3 ml-4">
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
                  <button
                    type="button"
                    onClick={() => {
                      if (clickable) onNavigate(step.path);
                    }}
                    disabled={!clickable}
                    className={`group w-full rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-[var(--b1-mid)] bg-white/70 shadow-sm"
                        : "border-white/50 bg-white/55 hover:bg-white/70"
                    } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                    title={
                      isLocked
                        ? "Complete previous steps to continue"
                        : canNavigate
                        ? "Open step"
                        : "Complete this step to unlock"
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div
                          className={`h-7 w-7 rounded-full flex items-center justify-center ${circleBg} ${ring}`}
                        >
                          {status === "done" ? (
                            <Check size={16} />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        {isActive && (
                          <div
                            className="absolute -inset-2 rounded-full blur-md opacity-70"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(149,213,178,0.8), rgba(149,213,178,0) 70%)",
                            }}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold truncate ${
                            isActive
                              ? "text-[var(--b1)]"
                              : status === "done"
                              ? "text-[var(--b1-mid)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                          Step {index + 1}
                          {status === "done"
                            ? " • Completed"
                            : isActive
                            ? " • In progress"
                            : isLocked
                            ? " • Locked"
                            : ""}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
});

