import React, { useMemo, useState } from "react";
import { Clock, MapPin, Megaphone } from "lucide-react";
import { Button } from "@/components/common";
import type { Property } from "@/features/properties/propertyType";
import { requestPropertyPromotionAPI } from "@/features/seller/sellerAPI";
import { useAppSelector } from "@/hooks/reduxHooks";
import PromotionModal from "./PromotionModal";

type Props = {
  properties: Property[];
  onPromotionSubmitted?: (propertyId: string) => void;
};

const getStatusLabel = (p: Property): string => {
  if (p.promotionStatus === "pending") return "Pending Approval";
  if (p.promotionStatus === "approved") {
    if (!p.featuredExpiryDate) return "Active";
    return new Date(p.featuredExpiryDate).getTime() > Date.now() ? "Active" : "Expired";
  }
  if (p.promotionStatus === "rejected") return "Rejected";
  return "Not Promoted";
};

const getStatusBadgeClasses = (p: Property): string => {
  if (p.promotionStatus === "pending") {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }
  if (p.promotionStatus === "approved") {
    const isExpired = p.featuredExpiryDate && new Date(p.featuredExpiryDate).getTime() <= Date.now();
    return isExpired
      ? "bg-rose-50 text-rose-700 ring-rose-100"
      : "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }
  if (p.promotionStatus === "rejected") {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }
  return "bg-slate-50 text-slate-700 ring-slate-100";
};

const getDaysRemaining = (p: Property): number | null => {
  if (p.promotionStatus !== "approved" || !p.featuredExpiryDate) return null;
  const diff = new Date(p.featuredExpiryDate).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const SellerPromotionSection: React.FC<Props> = ({ properties, onPromotionSubmitted }) => {
  const authUser = useAppSelector((s) => s.auth.user);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasUsedFreePromotion, setHasUsedFreePromotion] = useState(Boolean(authUser?.hasUsedFreePromotion));

  const items = useMemo(() => (Array.isArray(properties) ? properties : []), [properties]);

  const submitRequest = async (duration: 1 | 3 | 6) => {
    if (!selectedProperty) return;
    try {
      setSubmitting(true);
      const response = await requestPropertyPromotionAPI(selectedProperty._id, {
        durationMonths: duration,
      });
      if (response.isFirstPromotionFree) {
        setHasUsedFreePromotion(true);
      }
      onPromotionSubmitted?.(selectedProperty._id);
      setSelectedProperty(null);
    } finally {
      setSubmitting(false);
    }
  };

  const hasAnyPromotions = items.some((p) => p.promotionStatus && p.promotionStatus !== "none");

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--b2)] bg-[var(--b2-soft)]/40 p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--b1)] sm:text-xl">
            <Megaphone className="h-5 w-5 text-[var(--b1-mid)]" />
            Paid Property Promotion
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Boost visibility for your best listings. Choose a duration, submit a request, and track the status here.
          </p>
        </div>
        {hasAnyPromotions && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--white)] px-3 py-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-[var(--b1-mid)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active
            </div>
            <div className="flex items-center gap-1 text-[var(--muted)]">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Pending
            </div>
            <div className="flex items-center gap-1 text-[var(--muted)]">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              Expired / Rejected
            </div>
          </div>
        )}
      </div>

      {!items.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--b2)] bg-[var(--white)] p-8 text-center">
          <Megaphone className="mb-3 h-10 w-10 text-[var(--b1-mid)]" />
          <p className="text-base font-medium text-[var(--b1)]">No properties to promote yet</p>
          <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
            Once you add properties, you will be able to promote them here and see their performance at a glance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((property) => {
            const daysRemaining = getDaysRemaining(property);
            const badgeClasses = getStatusBadgeClasses(property);

            return (
              <article
                key={property._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--b2)]/80 bg-[var(--white)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--b1-mid)]/60 hover:shadow-md"
              >
                <div className="relative h-32 w-full overflow-hidden bg-[var(--b2-soft)] sm:h-36">
                  {property?.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-[var(--muted)]">
                      No image added
                    </div>
                  )}
                  <div
                    className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badgeClasses}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {getStatusLabel(property)}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 text-sm font-semibold text-[var(--b1)] sm:text-base">
                      {property.title}
                    </h3>
                    {(property.locationText || property.location) && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[var(--muted)] sm:text-sm">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          {property.locationText ||
                            (typeof property.location === "string"
                              ? property.location
                              : [
                                  property.location?.locality,
                                  property.location?.city,
                                  property.location?.state,
                                ]
                                  .filter(Boolean)
                                  .join(", "))}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    {typeof property.price === "number" && property.price > 0 && (
                      <div className="flex items-center gap-1 font-medium text-[var(--b1-mid)]">
                        <span>₹{property.price.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {daysRemaining !== null && (
                      <div className="flex items-center gap-1 text-[var(--b1-mid)]">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-medium">{daysRemaining} days left</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-1 flex justify-end">
                    <Button
                      className="!w-full !rounded-xl text-sm sm:text-[0.9rem]"
                      onClick={() => setSelectedProperty(property)}
                      disabled={submitting}
                    >
                      {property.promotionStatus === "approved" ? "Extend Promotion" : "Promote Now"}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <PromotionModal
        open={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        onSubmit={submitRequest}
        loading={submitting}
        isFirstPromotionFree={!hasUsedFreePromotion}
      />
    </section>
  );
};

export default SellerPromotionSection;
