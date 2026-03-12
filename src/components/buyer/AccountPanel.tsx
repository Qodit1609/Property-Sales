import React from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import type { BuyerPreference } from "../../features/buyer/buyerTypes";

interface AccountPanelProps {
  onUpdatePreferences?: (prefs: Partial<BuyerPreference>) => void;
}

const AccountPanel: React.FC<AccountPanelProps> = ({ onUpdatePreferences }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { preferences } = useAppSelector((state) => state.buyer);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)]">
      <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--b1)]">
          Profile details
        </h2>
        <div className="space-y-3 text-xs text-[var(--b1)]">
          <div>
            <p className="text-[11px] font-medium text-[var(--muted)]">Full name</p>
            <p className="mt-0.5 rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)] px-3 py-2 text-sm">
              {user?.name ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[var(--muted)]">Email</p>
            <p className="mt-0.5 rounded-lg border border-[var(--b2-soft)] bg-[var(--b2-soft)] px-3 py-2 text-sm">
              {user?.email ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-[var(--muted)]">Role</p>
            <p className="mt-0.5 inline-flex rounded-full bg-[var(--b2-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--b1-mid)]">
              Buyer
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-[var(--b2)] bg-[var(--white)] p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--b1)]">
              Buyer preferences
            </h2>
            <p className="text-[11px] text-[var(--muted)]">
              Used to personalize recommendations and alerts.
            </p>
          </div>
        </div>

        <form
          className="space-y-3 text-xs text-[var(--b1)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              Preferred locations
            </label>
            <input
              type="text"
              defaultValue={preferences.locations.join(", ")}
              placeholder="E.g. Indore bypass, Mhow, Rau, Ujjain road"
              className="mt-1 w-full rounded-lg border border-[var(--b2-soft)] bg-[var(--white)] px-3 py-2 text-sm text-[var(--b1)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-medium text-[var(--muted)]">
                Budget from (₹)
              </label>
              <input
                type="number"
                defaultValue={preferences.minPrice}
                className="mt-1 w-full rounded-lg border border-[var(--b2-soft)] bg-[var(--white)] px-3 py-2 text-sm text-[var(--b1)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[var(--muted)]">
                Budget to (₹)
              </label>
              <input
                type="number"
                defaultValue={preferences.maxPrice}
                className="mt-1 w-full rounded-lg border border-[var(--b2-soft)] bg-[var(--white)] px-3 py-2 text-sm text-[var(--b1)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--b2)]"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[var(--muted)]">
              Property focus
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Agriculture land", "Farmhouse", "Resort", "Agri resort"].map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    className="rounded-full bg-[var(--b2-soft)] px-3 py-1 text-[11px] text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2)]"
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={() =>
                onUpdatePreferences?.({
                  /* hook for future wiring */
                })
              }
              className="inline-flex items-center justify-center rounded-lg bg-[var(--b1-mid)] px-4 py-2 text-[11px] font-semibold text-[var(--fg)] shadow ring-1 ring-[var(--b2)] hover:bg-[var(--b1)]"
            >
              Save preference blueprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPanel;

