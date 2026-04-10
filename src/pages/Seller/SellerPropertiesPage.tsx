import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Building2, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import { createListing, deleteListing, fetchMyListings, updateListing } from "../../features/seller/sellerSlice";
import type { Property } from "../../features/properties/propertyType";
import { Button } from "@/components/common";
import { buildDuplicateListingPayload, getSellerListingDisplayStatus } from "../../lib/sellerHelpers";
import { SellerPropertiesTable } from "@/components/seller/SellerPropertiesTable";
import { SellerEmptyState } from "@/components/seller/SellerEmptyState";

type DashboardFilter = "all" | "active" | "pending" | "rejected" | "leads" | "views";

const SellerPropertiesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { listings, loading, error, actionLoading } = useAppSelector((state: RootState) => state.seller);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("sellerDashboard.confirmDelete"))) return;
    await dispatch(deleteListing(id));
  };

  const handleDuplicate = useCallback(
    async (p: Property) => {
      try {
        await dispatch(createListing(buildDuplicateListingPayload(p))).unwrap();
        setBanner(t("sellerPanel.duplicateSuccess"));
        window.setTimeout(() => setBanner(null), 5000);
      } catch {
        setBanner(t("sellerPanel.duplicateError"));
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
        setBanner(t("sellerPanel.statusAction.success"));
        window.setTimeout(() => setBanner(null), 4000);
      } catch {
        setBanner(t("sellerPanel.statusAction.error"));
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

  const selectedFilter = useMemo<DashboardFilter>(() => {
    const raw = searchParams.get("filter");
    if (
      raw === "all" ||
      raw === "active" ||
      raw === "pending" ||
      raw === "rejected" ||
      raw === "leads" ||
      raw === "views"
    ) {
      return raw;
    }
    return "all";
  }, [searchParams]);

  const filteredListings = useMemo(() => {
    if (selectedFilter === "all") return listings;
    if (selectedFilter === "active") {
      return listings.filter((property) => getSellerListingDisplayStatus(property as Property) === "approved");
    }
    if (selectedFilter === "pending") {
      return listings.filter((property) => getSellerListingDisplayStatus(property as Property) === "pending");
    }
    if (selectedFilter === "rejected") {
      return listings.filter((property) => getSellerListingDisplayStatus(property as Property) === "rejected");
    }
    if (selectedFilter === "leads") {
      return listings.filter((property) => (property.analytics?.contactClicks ?? 0) > 0);
    }
    return listings.filter((property) => (property.analytics?.views ?? 0) > 0);
  }, [listings, selectedFilter]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-[var(--b1)] sm:text-2xl">
            <List className="h-6 w-6 shrink-0 text-[var(--b1-mid)]" />
            {t("sellerDashboard.myProperties")}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerDashboard.propertiesPageSubtitle")}</p>
        </div>
        <Link to="/post-property/basic" className="w-full sm:w-auto">
          <Button className="!w-full sm:!w-auto !rounded-xl !bg-[var(--b1)] !px-5 !py-2.5 !text-white !shadow-sm hover:!opacity-90">
            {t("sellerDashboard.addPropertyCta")}
          </Button>
        </Link>
      </div>

      <AnimatePresence>
        {banner ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl border border-[var(--b2)] bg-[var(--white)] px-4 py-3 text-sm text-[var(--b1)] shadow-sm"
          >
            {banner}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">{t("sellerDashboard.loadingListings")}</p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-[var(--error)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error)]">
          {error}
        </p>
      ) : null}

      {filteredListings.length === 0 && !loading ? (
        <SellerEmptyState
          icon={Building2}
          title={t("sellerDashboard.emptyTitle")}
          description={t("sellerDashboard.emptyDescription")}
          action={
            <Link to="/post-property/basic">
              <Button className="!rounded-xl !bg-[var(--b1)] !px-6 !py-2.5 !text-white hover:!opacity-90">
                {t("sellerDashboard.addPropertyCta")}
              </Button>
            </Link>
          }
        />
      ) : (
        <SellerPropertiesTable
          listings={filteredListings as Property[]}
          actionLoading={actionLoading}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onMarkSold={handleMarkSold}
          onMarkUnsold={handleMarkUnsold}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
        />
      )}
    </section>
  );
};

export default SellerPropertiesPage;
