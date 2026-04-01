import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "./sellerUtils";

type Item = { id: string; titleKey: string; descKey: string; time: string; unread?: boolean };

const MOCK_ITEMS: Item[] = [
  { id: "1", titleKey: "sellerPanel.notifications.approvedTitle", descKey: "sellerPanel.notifications.approvedDesc", time: "2h", unread: true },
  { id: "2", titleKey: "sellerPanel.notifications.leadTitle", descKey: "sellerPanel.notifications.leadDesc", time: "1d", unread: true },
  { id: "3", titleKey: "sellerPanel.notifications.rejectedTitle", descKey: "sellerPanel.notifications.rejectedDesc", time: "3d", unread: false },
];

export function SellerNotificationsBell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () =>
      MOCK_ITEMS.map((row) => ({
        ...row,
        title: t(row.titleKey),
        description: t(row.descKey),
      })),
    [t]
  );

  const unread = items.filter((i) => i.unread).length;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--b2)]/80 bg-[var(--white)] text-[var(--b1)] shadow-sm transition hover:bg-[var(--b2-soft)] hover:shadow-md",
          open && "ring-2 ring-[var(--b2)]/80"
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("sellerPanel.notifications.aria")}
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--b1)] px-1 text-[10px] font-semibold text-[var(--fg)]">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-[80] mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-[0_16px_40px_rgba(27,67,50,0.12)]"
          >
            <div className="border-b border-[var(--b2)]/80 bg-gradient-to-r from-[var(--b2-soft)] to-[var(--white)] px-4 py-3">
              <p className="text-sm font-semibold text-[var(--b1)]">{t("sellerPanel.notifications.heading")}</p>
              <p className="text-xs text-[var(--muted)]">{t("sellerPanel.notifications.sub")}</p>
            </div>
            <ul className="max-h-[min(70vh,320px)] divide-y divide-[var(--b2)]/60 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-[var(--b2-soft)]/80"
                    onClick={close}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        n.unread ? "bg-[var(--b1)]" : "bg-[var(--b2)]"
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-[var(--b1)]">{n.title}</span>
                      <span className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">{n.description}</span>
                    </span>
                    <span className="shrink-0 text-[10px] uppercase tracking-wide text-[var(--muted)]">{n.time}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
