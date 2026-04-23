import React, { useState } from "react";
import { Bell, ChevronDown, LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import { Button } from "@/components/common";

interface BuyerHeaderActionsProps {
  onLogout: () => void;
}

const BuyerHeaderActions: React.FC<BuyerHeaderActionsProps> = ({
  onLogout,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/buyer/notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--b2-soft)] text-[var(--b1-mid)] shadow-inner shadow-[var(--b2)]/40 ring-1 ring-[var(--b2)] hover:text-[var(--b1)]"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-slate-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>

      <div className="relative">
        <Button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          variant="ghost"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--b1)] ring-1 ring-[var(--b2)] hover:bg-[var(--b2-soft)]"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--b2)] text-[var(--b1)] text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() ?? "B"}
          </span>

          <div className="hidden text-left sm:block">
            <p className="text-[11px] leading-tight text-[var(--b1)]">
              {user?.name ?? "Buyer"}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--b1-mid)]">
              Buyer
            </p>
          </div>

          <ChevronDown className="h-3 w-3 text-[var(--muted)]" />
        </Button>

        {open && (
          <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-[var(--b2)] bg-[var(--white)] text-xs shadow-lg shadow-[var(--b2)]/40">
            <div className="border-b border-[var(--b2-soft)] px-3 py-2">
              <p className="text-[11px] font-semibold text-[var(--b1)]">
                {user?.name ?? "Buyer"}
              </p>
              <p className="truncate text-[10px] text-[var(--muted)]">
                {user?.email ?? "Signed in"}
              </p>
            </div>

            <div className="px-1 py-1">
              <Link
                to="/buyer/account"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--b1)] hover:bg-[var(--b2-soft)]"
                onClick={() => setOpen(false)}
              >
                <User2 className="h-3.5 w-3.5" />
                <span>Account settings</span>
              </Link>
            </div>

            <Button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              variant="ghost"
              className="flex w-full items-center gap-2 border-t border-[var(--b2-soft)] px-3 py-2 text-[11px] font-medium text-[var(--error)] hover:bg-[var(--error-bg)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerHeaderActions;