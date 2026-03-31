import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { mapMediaToProperties } from "../../utils/mapMediaToProperties";
import { collectCloudinaryUrlPool } from "../../utils/propertyImagePool";

export const selectMediaItems = (state: RootState) => state.media.items;
export const selectMediaOrphans = (state: RootState) => state.media.orphans;
export const selectMediaLoading = (state: RootState) => state.media.loading;
export const selectMediaError = (state: RootState) => state.media.error;

/** All unique Cloudinary URLs from media API (linked + orphan rows). Used when id → URL map has no entry. */
export const selectCloudinaryUrlPool = createSelector(
  [selectMediaItems, selectMediaOrphans],
  (items, orphans) => collectCloudinaryUrlPool(items, orphans),
);

/** Strict map: only assets that include propertyId / ref on the server. */
export const selectPropertyImagesMap = createSelector(
  [selectMediaItems],
  (items) => mapMediaToProperties(items),
);
