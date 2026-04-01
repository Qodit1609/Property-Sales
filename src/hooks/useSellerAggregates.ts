import { useMemo } from "react";
import type { Property } from "../features/properties/propertyType";
import { getSellerListingDisplayStatus } from "../lib/sellerHelpers";

export type SellerAggregateStats = {
  total: number;
  activeListings: number;
  pending: number;
  rejected: number;
  sold: number;
  totalViews: number;
  totalLeads: number;
};

export function useSellerAggregates(listings: Property[]): SellerAggregateStats {
  return useMemo(() => {
    let activeListings = 0;
    let pending = 0;
    let rejected = 0;
    let sold = 0;
    let totalViews = 0;
    let totalLeads = 0;

    for (const p of listings) {
      const s = getSellerListingDisplayStatus(p);
      if (s === "sold") sold += 1;
      else if (s === "approved") activeListings += 1;
      else if (s === "rejected") rejected += 1;
      else pending += 1;

      totalViews += p.analytics?.views ?? 0;
      totalLeads += p.analytics?.contactClicks ?? 0;
    }

    return {
      total: listings.length,
      activeListings,
      pending,
      rejected,
      sold,
      totalViews,
      totalLeads,
    };
  }, [listings]);
}
