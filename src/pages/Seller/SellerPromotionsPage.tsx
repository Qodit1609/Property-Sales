import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SellerPromotionSection from "@/components/seller/SellerPromotionSection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchMyListings } from "@/features/seller/sellerSlice";

const SellerPromotionsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { listings, loading } = useAppSelector((state) => state.seller);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-[var(--b1)] sm:text-2xl">{t("sellerPanel.promo.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("sellerPanel.promo.sub")}</p>
      </div>

      {loading ? <p className="text-sm text-[var(--muted)]">Loading promotions...</p> : null}
      <SellerPromotionSection
        properties={listings ?? []}
        onPromotionSubmitted={() => {
          dispatch(fetchMyListings());
        }}
      />
    </section>
  );
};

export default SellerPromotionsPage;
