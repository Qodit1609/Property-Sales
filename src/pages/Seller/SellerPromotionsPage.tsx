import { motion } from "framer-motion";
import { Megaphone, MousePointerClick, Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const SellerPromotionsPage = () => {
  const { t } = useTranslation();

  const cards = [
    {
      key: "featured",
      icon: Sparkles,
      titleKey: "sellerPanel.promo.featuredTitle",
      descKey: "sellerPanel.promo.featuredDesc",
      impressions: "12.4k",
      clicks: "428",
      perf: "+18%",
    },
    {
      key: "boost",
      icon: TrendingUp,
      titleKey: "sellerPanel.promo.boostTitle",
      descKey: "sellerPanel.promo.boostDesc",
      impressions: "8.1k",
      clicks: "310",
      perf: "+12%",
    },
    {
      key: "priority",
      icon: Megaphone,
      titleKey: "sellerPanel.promo.priorityTitle",
      descKey: "sellerPanel.promo.priorityDesc",
      impressions: "5.6k",
      clicks: "198",
      perf: "+9%",
    },
  ] as const;

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.promo.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.promo.sub")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.article
              key={c.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="flex flex-col rounded-2xl border border-[var(--b2)]/80 bg-gradient-to-br from-[var(--white)] to-[var(--b2-soft)]/50 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--b1)] text-[var(--fg)] shadow-inner">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[var(--b1)]">{t(c.titleKey)}</h2>
                  <p className="text-xs text-[var(--muted)]">{t(c.descKey)}</p>
                </div>
              </div>
              <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-[var(--b2)]/60 pt-4 text-center">
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {t("sellerPanel.promo.impressions")}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--b1)]">{c.impressions}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {t("sellerPanel.promo.clicks")}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--b1)]">{c.clicks}</dd>
                </div>
                <div>
                  <dt className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    <MousePointerClick className="h-3 w-3" />
                    {t("sellerPanel.promo.performance")}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--b1-mid)]">{c.perf}</dd>
                </div>
              </dl>
              <button
                type="button"
                disabled
                className="mt-5 w-full rounded-xl border border-[var(--b2)] bg-[var(--white)] py-2.5 text-sm font-semibold text-[var(--b1)] opacity-70"
              >
                {t("sellerPanel.promo.ctaSoon")}
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default SellerPromotionsPage;
