import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, List } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import type { RootState } from "../../app/store";
import { deleteListing, fetchMyListings } from "../../features/seller/sellerSlice";
import type { Property } from "../../features/properties/propertyType";
import { Button } from "@/components/common";
import SellerListingsTable from "../../components/seller/SellerListingsTable";

const SellerPropertiesPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { listings, loading, error, actionLoading } = useAppSelector(
    (state: RootState) => state.seller
  );

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("sellerDashboard.confirmDelete"))) return;
    await dispatch(deleteListing(id));
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-[var(--b1)] sm:text-2xl">
            <List className="h-6 w-6 shrink-0 text-[var(--b1-mid)]" />
            {t("sellerDashboard.myProperties")}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t("sellerDashboard.propertiesPageSubtitle")}
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
          <SellerListingsTable
            listings={listings as Property[]}
            actionLoading={actionLoading}
            onDelete={handleDelete}
          />
        </div>
      )}
    </section>
  );
};

export default SellerPropertiesPage;
