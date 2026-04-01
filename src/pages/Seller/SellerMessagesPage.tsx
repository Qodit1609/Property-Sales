import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/components/seller/sellerUtils";

type Thread = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
};

const THREADS: Thread[] = [
  { id: "t1", name: "Priya · Farmland", preview: "Is the borewell certificate available?", time: "10:42", unread: true },
  { id: "t2", name: "Vikram · Farmhouse", preview: "We can visit this weekend.", time: "Yesterday", unread: false },
  { id: "t3", name: "Neha · Plot", preview: "Please share the exact pin location.", time: "Mon", unread: false },
];

const SellerMessagesPage = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(THREADS[0]?.id ?? "");

  const current = useMemo(() => THREADS.find((x) => x.id === active) ?? THREADS[0], [active]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.messages.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.messages.sub")}</p>
      </div>

      <div className="grid min-h-[480px] grid-cols-1 overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm lg:grid-cols-[minmax(0,320px)_1fr]">
        <div className="border-b border-[var(--b2)]/80 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 border-b border-[var(--b2)]/60 bg-[var(--b2-soft)]/50 px-4 py-3">
            <Inbox className="h-5 w-5 text-[var(--b1-mid)]" />
            <span className="text-sm font-semibold text-[var(--b1)]">{t("sellerPanel.messages.inbox")}</span>
          </div>
          <ul className="max-h-[420px] overflow-y-auto">
            {THREADS.map((th) => (
              <li key={th.id}>
                <button
                  type="button"
                  onClick={() => setActive(th.id)}
                  className={cn(
                    "flex w-full flex-col gap-0.5 border-b border-[var(--b2)]/40 px-4 py-3 text-left transition",
                    active === th.id ? "bg-[var(--b2-soft)]" : "hover:bg-[var(--b2-soft)]/60"
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-[var(--b1)]">{th.name}</span>
                    <span className="shrink-0 text-[10px] text-[var(--muted)]">{th.time}</span>
                  </span>
                  <span className="line-clamp-1 text-xs text-[var(--muted)]">{th.preview}</span>
                  {th.unread ? (
                    <span className="mt-1 inline-flex w-fit rounded-full bg-[var(--b1)] px-2 py-0.5 text-[10px] font-semibold text-[var(--fg)]">
                      {t("sellerPanel.messages.unread")}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-[var(--b2)]/60 px-5 py-4">
            <p className="text-sm font-semibold text-[var(--b1)]">{current?.name}</p>
            <p className="text-xs text-[var(--muted)]">{t("sellerPanel.messages.encrypted")}</p>
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="space-y-3 px-5 py-6">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[var(--b1)] px-4 py-2.5 text-sm text-[var(--fg)] shadow-sm"
              >
                {t("sellerPanel.messages.placeholderYou")}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="max-w-[85%] rounded-2xl rounded-bl-md border border-[var(--b2)] bg-[var(--b2-soft)]/50 px-4 py-2.5 text-sm text-[var(--b1)]"
              >
                {current?.preview}
              </motion.div>
            </div>
            <div className="border-t border-[var(--b2)]/60 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  readOnly
                  placeholder={t("sellerPanel.messages.composerPlaceholder")}
                  className="min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--b2)] bg-[var(--white)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--b2)]"
                />
                <button
                  type="button"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--b1)] text-[var(--fg)] shadow-sm transition hover:opacity-90"
                  aria-label={t("sellerPanel.messages.send")}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerMessagesPage;
