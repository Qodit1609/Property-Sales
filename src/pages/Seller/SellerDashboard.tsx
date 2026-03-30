import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import { deleteListing, fetchMyListings } from "../../features/seller/sellerSlice";
import type { Property } from "../../features/properties/propertyType";
import { Button } from "@/components/common";
import { normalizeListingStatus } from "../../lib/sellerHelpers";
import SellerListingsTable from "../../components/seller/SellerListingsTable";

const SellerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { listings, loading, error, actionLoading } = useAppSelector(
    (state: RootState) => state.seller
  );

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const stats = useMemo(() => {
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    for (const p of listings) {
      const s = normalizeListingStatus(
        p.status ?? p.statusDetails?.approvalStatus
      );
      if (s === "approved") approved += 1;
      else if (s === "rejected") rejected += 1;
      else pending += 1;
    }
    return {
      total: listings.length,
      approved,
      pending,
      rejected,
    };
  }, [listings]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("sellerDashboard.confirmDelete"))) return;
    await dispatch(deleteListing(id));
  };

  const statCards = [
    {
      key: "total",
      label: t("sellerDashboard.statsTotal"),
      value: stats.total,
      icon: Building2,
      className: "border-[var(--b2)] bg-[var(--white)]",
    },
    {
      key: "approved",
      label: t("sellerDashboard.statsApproved"),
      value: stats.approved,
      icon: CheckCircle2,
      className: "border-[var(--success)]/30 bg-[var(--success-bg)]",
    },
    {
      key: "pending",
      label: t("sellerDashboard.statsPending"),
      value: stats.pending,
      icon: Clock,
      className: "border-[var(--warning)]/30 bg-[var(--warning-bg)]",
    },
    {
      key: "rejected",
      label: t("sellerDashboard.statsRejected"),
      value: stats.rejected,
      icon: XCircle,
      className: "border-[var(--error)]/30 bg-[var(--error-bg)]",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-[var(--b1)] sm:text-2xl">
            <LayoutDashboard className="h-6 w-6 shrink-0 text-[var(--b1-mid)]" />
            {t("sellerDashboard.overviewTitle")}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("sellerDashboard.overviewSubtitle")}
          </p>
        </div>
        <Link to="/post-property/basic">
          <Button className="!rounded-xl !bg-[var(--b1)] !px-5 !py-2.5 !text-white !shadow-sm hover:!opacity-90">
            {t("sellerDashboard.addPropertyCta")}
          </Button>
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-[var(--muted)]">
          {t("sellerDashboard.loadingListings")}
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-[var(--error)] bg-[var(--error-bg)] px-4 py-3 text-sm text-[var(--error)]">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.key}
              className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${card.className}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--b1)]">
                    {card.value}
                  </p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--white)]/80 text-[var(--b1)] shadow-inner">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {listings.length === 0 && !loading ? (
        <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] px-6 py-14 text-center shadow-sm">
          <Building2 className="mx-auto h-12 w-12 text-[var(--b2)]" />
          <h2 className="mt-4 text-lg font-semibold text-[var(--b1)]">
            {t("sellerDashboard.emptyTitle")}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t("sellerDashboard.emptyDescription")}
          </p>
          <Link to="/post-property/basic" className="mt-6 inline-block">
            <Button className="!rounded-xl !bg-[var(--b1)] !px-6 !py-2.5 !text-white hover:!opacity-90">
              {t("sellerDashboard.addPropertyCta")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--b2)] bg-[var(--white)] shadow-sm">
          <div className="flex flex-col gap-1 border-b border-[var(--b2)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-[var(--b1)]">
              {t("sellerDashboard.recentHeading")}
            </h2>
            <Link
              to="/seller/properties"
              className="text-sm font-medium text-[var(--b1-mid)] hover:underline"
            >
              {t("sellerDashboard.viewAll")}
            </Link>
          </div>

          <SellerListingsTable
            listings={listings as Property[]}
            actionLoading={actionLoading}
            onDelete={handleDelete}
            limit={5}
          />
        </div>
      )}
    </section>
  );
};

export default SellerDashboard;
