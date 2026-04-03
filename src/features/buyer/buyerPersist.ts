import type { Property } from "../properties/propertyType";
import { propertyToMeta } from "./propertyToMeta";
import type { BuyerState } from "./buyerSlice";
import { initialBuyerState } from "./buyerSlice";

const STORAGE_KEY = "bhoomi_buyer_state_v2";

type LegacyBuyer = Partial<BuyerState> & {
  wishlist?: Property[];
  compareList?: Property[];
  cart?: Property[];
};

function migrateLegacy(o: LegacyBuyer): BuyerState {
  const entities: Record<string, (typeof initialBuyerState.entities)[string]> = {
    ...initialBuyerState.entities,
    ...(o.entities ?? {}),
  };

  const wishlistIds = Array.isArray(o.wishlistIds)
    ? o.wishlistIds
    : (o.wishlist?.map((p) => {
        entities[p._id] = propertyToMeta(p);
        return p._id;
      }) ?? []);

  const compareIdsRaw = Array.isArray(o.compareIds)
    ? o.compareIds
    : (o.compareList?.map((p) => {
        entities[p._id] = propertyToMeta(p);
        return p._id;
      }) ?? []);
  const compareIds = compareIdsRaw.slice(0, 3);

  const cartIds = Array.isArray(o.cartIds)
    ? o.cartIds
    : (o.cart?.map((p) => {
        entities[p._id] = propertyToMeta(p);
        return p._id;
      }) ?? []);

  return {
    ...initialBuyerState,
    wishlistIds,
    compareIds,
    cartIds,
    recentIds: Array.isArray(o.recentIds) ? o.recentIds : initialBuyerState.recentIds,
    entities,
    savedSearches: o.savedSearches ?? initialBuyerState.savedSearches,
    preferences: o.preferences ?? initialBuyerState.preferences,
    activity: o.activity ?? initialBuyerState.activity,
    notifications: o.notifications ?? initialBuyerState.notifications,
    compareNotice: null,
    compareHighlightDiff: Boolean(o.compareHighlightDiff),
  };
}

export function loadPersistedBuyerState(): BuyerState | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as LegacyBuyer;
    return migrateLegacy(parsed);
  } catch {
    return undefined;
  }
}

export function persistBuyerState(state: BuyerState): void {
  if (typeof window === "undefined") return;
  try {
    const serializable: BuyerState = {
      ...state,
      compareNotice: null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    /* ignore quota */
  }
}

export function clearPersistedBuyerState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
