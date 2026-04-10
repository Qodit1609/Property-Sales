import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  LayoutDashboard,
  MousePointerClick,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import { createListing, deleteListing, fetchMyListings, updateListing } from "../../features/seller/sellerSlice";
import { buildDuplicateListingPayload } from "../../lib/sellerHelpers";
import type { Property } from "../../features/properties/propertyType";
import { Button } from "@/components/common";
import { useSellerAggregates } from "../../hooks/useSellerAggregates";
import { SellerCharts } from "@/components/seller/SellerCharts";
import { SellerLeadsCard } from "@/components/seller/SellerLeadsCard";
import { PropertyInsights } from "@/components/seller/PropertyInsights";
import { SellerPropertiesTable } from "@/components/seller/SellerPropertiesTable";
import { SellerEmptyState } from "@/components/seller/SellerEmptyState";
import { SellerStats } from "@/components/seller/SellerStats";
import { SellerStatsSkeleton } from "@/components/seller/SellerSkeleton";
import type { SellerStatItem } from "@/components/seller/SellerStats";
import { cn } from "@/components/seller/sellerUtils";
import { SellerNotificationsBell } from "@/components/seller/SellerNotificationsBell";

const SellerDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { listings, loading, error, actionLoading } = useAppSelector((state: RootState) => state.seller);
  const [banner, setBanner] = useState<{ text: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const agg = useSellerAggregates(listings as Property[]);

  const statItems: SellerStatItem[] = useMemo(
    () => [
      {
        key: "total",
        label: t("sellerPanel.stats.totalProperties"),
        value: agg.total,
        icon: Building2,
        accent: "neutral",
        to: "/seller/properties?filter=all",
      },
      {
        key: "active",
        label: t("sellerPanel.stats.activeListings"),
        value: agg.activeListings,
        icon: CheckCircle2,
        accent: "success",
        to: "/seller/properties?filter=active",
      },
      {
        key: "pending",
        label: t("sellerPanel.stats.pendingApproval"),
        value: agg.pending,
        icon: Clock,
        accent: "warning",
        to: "/seller/properties?filter=pending",
      },
      {
        key: "rejected",
        label: t("sellerPanel.stats.rejected"),
        value: agg.rejected,
        icon: XCircle,
        accent: "danger",
        to: "/seller/properties?filter=rejected",
      },
      {
        key: "leads",
        label: t("sellerPanel.stats.totalLeads"),
        value: agg.totalLeads,
        icon: MousePointerClick,
        accent: "info",
        to: "/seller/properties?filter=leads",
      },
      {
        key: "views",
        label: t("sellerPanel.stats.totalViews"),
        value: agg.totalViews,
        icon: Eye,
        accent: "neutral",
        to: "/seller/properties?filter=views",
      },
    ],
    [agg, t]
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("sellerDashboard.confirmDelete"))) return;
    await dispatch(deleteListing(id));
  };

  const handleDuplicate = useCallback(
    async (p: Property) => {
      try {
        await dispatch(createListing(buildDuplicateListingPayload(p))).unwrap();
        setBanner({ text: t("sellerPanel.duplicateSuccess"), variant: "success" });
        window.setTimeout(() => setBanner(null), 5000);
      } catch {
        setBanner({ text: t("sellerPanel.duplicateError"), variant: "error" });
        window.setTimeout(() => setBanner(null), 6000);
      }
    },
    [dispatch, t]
  );

  const applyAvailabilityStatus = useCallback(
    async (p: Property, availabilityStatus: "Sold" | "Available" | "Deactivated") => {
      try {
        await dispatch(
          updateListing({
            id: p._id,
            payload: { availabilityStatus },
          })
        ).unwrap();
        setBanner({ text: t("sellerPanel.statusAction.success"), variant: "success" });
        window.setTimeout(() => setBanner(null), 4000);
      } catch {
        setBanner({ text: t("sellerPanel.statusAction.error"), variant: "error" });
        window.setTimeout(() => setBanner(null), 5000);
      }
    },
    [dispatch, t]
  );

  const handleMarkSold = useCallback(
    async (p: Property) => {
      await applyAvailabilityStatus(p, "Sold");
    },
    [applyAvailabilityStatus]
  );

  const handleMarkUnsold = useCallback(
    async (p: Property) => {
      await applyAvailabilityStatus(p, "Available");
    },
    [applyAvailabilityStatus]
  );

  const handleDeactivate = useCallback(
    async (p: Property) => {
      await applyAvailabilityStatus(p, "Deactivated");
    },
    [applyAvailabilityStatus]
  );

  const handleActivate = useCallback(
    async (p: Property) => {
      await applyAvailabilityStatus(p, "Available");
    },
    [applyAvailabilityStatus]
  );

  return (
    <section className="space-y-6 md:space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-[var(--b2)]/90 bg-gradient-to-br from-[var(--white)] via-[var(--white)] to-[var(--b2-soft)]/45 p-5 shadow-sm sm:p-6">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--b2)]/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-8 left-1/4 h-28 w-52 rounded-full bg-[var(--b1-mid)]/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--white)]/90 text-[var(--b1)] shadow-sm ring-1 ring-[var(--b2)]/70">
              <LayoutDashboard className="h-6 w-6 text-[var(--b1-mid)]" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-xl font-semibold leading-tight text-[var(--b1)] sm:text-2xl">
                {t("sellerDashboard.overviewTitle")}
              </h1>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                {t("sellerDashboard.overviewSubtitle")}
              </p>
            </div>
          </div>
          <div className="flex w-full shrink-0 justify-end self-start sm:w-auto">
            <SellerNotificationsBell dropdownAlign="right" />
          </div>
        </div>
      </div>

      {loading ? <SellerStatsSkeleton /> : <SellerStats items={statItems} />}

      <AnimatePresence>
        {banner ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-4 py-3.5 font-sans text-sm shadow-sm",
              banner.variant === "success"
                ? "border-[var(--b2)] bg-[var(--white)] text-[var(--b1)]"
                : "border-[var(--error)]/25 bg-[var(--error-bg)] text-[var(--error)]"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                banner.variant === "success"
                  ? "bg-[var(--b2-soft)] text-[var(--b1-mid)]"
                  : "bg-[var(--white)] text-[var(--error)]"
              )}
            >
              {banner.variant === "success" ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              ) : (
                <AlertCircle className="h-4 w-4" aria-hidden />
              )}
            </span>
            <span className="min-w-0 pt-0.5 leading-relaxed">{banner.text}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {error ? (
        <p className="flex items-start gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error-bg)] px-4 py-3.5 font-sans text-sm text-[var(--error)]">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 opacity-90" aria-hidden />
          <span className="min-w-0 leading-relaxed">{error}</span>
        </p>
      ) : null}

      {!loading && listings.length > 0 ? (
        <>
          <SellerCharts listings={listings as Property[]} />
          <div className="grid grid-cols-1 gap-5 lg:gap-6 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <SellerLeadsCard />
            </div>
            <div className="space-y-5 xl:col-span-3">
              <PropertyInsights />
              <div className="overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm ring-1 ring-black/[0.02]">
                <div className="flex flex-col gap-2 border-b border-[var(--b2)]/70 bg-gradient-to-r from-[var(--white)] to-[var(--b2-soft)]/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <h2 className="font-serif text-base font-semibold text-[var(--b1)]">{t("sellerDashboard.recentHeading")}</h2>
                  <Link
                    to="/seller/properties"
                    className="inline-flex items-center gap-1 font-sans text-sm font-medium text-[var(--b1-mid)] transition hover:text-[var(--b1)] hover:underline"
                  >
                    {t("sellerDashboard.viewAll")}
                    <ArrowRight className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </Link>
                </div>
                <SellerPropertiesTable
                  listings={listings as Property[]}
                  actionLoading={actionLoading}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onMarkSold={handleMarkSold}
                  onMarkUnsold={handleMarkUnsold}
                  onDeactivate={handleDeactivate}
                  onActivate={handleActivate}
                  limit={5}
                  compact
                />
              </div>
            </div>
          </div>
        </>
      ) : null}

      {listings.length === 0 && !loading ? (
        <SellerEmptyState
          icon={Building2}
          title={t("sellerDashboard.emptyTitle")}
          description={t("sellerDashboard.emptyDescription")}
          action={
            <Link to="/post-property/basic" className="inline-flex">
              <Button className="!rounded-xl !bg-[var(--b1)] !px-7 !py-3 !font-sans !text-sm !font-semibold !text-[var(--fg)] shadow-md !shadow-[var(--b1)]/20 transition hover:!opacity-95 hover:!shadow-lg">
                {t("sellerDashboard.addPropertyCta")}
              </Button>
            </Link>
          }
        />
      ) : null}
    </section>
  );
};

export default SellerDashboard;
