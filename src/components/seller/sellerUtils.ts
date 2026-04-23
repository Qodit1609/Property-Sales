import { twMerge } from "tailwind-merge";

/** Desktop seller sidebar widths (px). Must match SellerSidebar + SellerShellLayout spacer. */
export const SELLER_SIDEBAR_WIDTH_EXPANDED = 280;
export const SELLER_SIDEBAR_WIDTH_COLLAPSED = 72;

export function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}
