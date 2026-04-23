export type PostPropertyStepKey =
  | "basic"
  | "location"
  | "profile"
  | "media"
  | "documents"
  | "amenities"
  | "review";

export const POST_PROPERTY_STEPS: Array<{
  key: PostPropertyStepKey;
  label: string;
  path: string;
}> = [
  { key: "basic", label: "Basic Details", path: "/post-property/basic" },
  { key: "location", label: "Location", path: "/post-property/location" },
  { key: "profile", label: "Profile", path: "/post-property/profile" },
  { key: "media", label: "Media", path: "/post-property/media" },
  { key: "documents", label: "Documents", path: "/post-property/documents" },
  { key: "amenities", label: "Amenities", path: "/post-property/amenities" },
  { key: "review", label: "Review", path: "/post-property/review" },
];

