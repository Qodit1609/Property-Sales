import type {
  BasicDetails,
  LocationDetails,
  MediaState,
  ProfileDetails,
} from "./postPropertyTypes";

export type ValidationErrors<T extends Record<string, unknown>> = Partial<
  Record<keyof T, string>
>;

export function validateBasicDetails(values: BasicDetails) {
  const errors: ValidationErrors<BasicDetails> = {};
  if (!values.listingType) errors.listingType = "Select listing type";
  if (!values.category) errors.category = "Select category";
  if (!values.propertyType) errors.propertyType = "Select property type";
  if (!values.title.trim()) errors.title = "Enter a title";
  if (!values.contactName.trim()) errors.contactName = "Enter contact name";
  if (!values.contactEmail.trim()) errors.contactEmail = "Enter email";
  if (!values.contactMobile.trim()) errors.contactMobile = "Enter mobile number";
  return errors;
}

export function validateLocationDetails(values: LocationDetails) {
  const errors: ValidationErrors<LocationDetails> = {};
  if (!values.state.trim()) errors.state = "State is required";
  if (!values.city.trim()) errors.city = "City is required";
  if (!values.tehsil.trim()) errors.tehsil = "Tehsil is required";
  if (!values.village.trim()) errors.village = "Village is required";
  if (!values.locality.trim()) errors.locality = "Locality is required";
  if (!values.pinCode.trim()) errors.pinCode = "Pin code is required";
  // survey number is important for agriculture land; handled in UI depending on category
  return errors;
}

export function validateProfileDetails(
  values: ProfileDetails,
  basicDetails?: BasicDetails
) {
  const errors: ValidationErrors<ProfileDetails> = {};
  if (values.totalArea == null || Number.isNaN(values.totalArea) || values.totalArea <= 0) {
    errors.totalArea = "Enter total area";
  }
  if (values.price == null || Number.isNaN(values.price) || values.price <= 0) {
    errors.price = "Enter price";
  }
  if (!values.ownershipType) errors.ownershipType = "Select ownership type";
  const isAgricultureLandProfile =
    basicDetails?.category === "Agriculture Land" ||
    basicDetails?.propertyType === "Agriculture Land" ||
    basicDetails?.propertyType === "Farmland" ||
    basicDetails?.propertyType === "Plot";
  const requiresResidentialSpecs =
    !isAgricultureLandProfile &&
    ["House", "Apartment", "Flat", "Villa", "Farmhouse", "Resort"].includes(
      basicDetails?.propertyType ?? ""
    );
  if (requiresResidentialSpecs) {
    if (
      values.bedrooms == null ||
      Number.isNaN(values.bedrooms) ||
      values.bedrooms < 0
    ) {
      errors.bedrooms = "Enter bedrooms";
    }
    if (
      values.bathrooms == null ||
      Number.isNaN(values.bathrooms) ||
      values.bathrooms < 0
    ) {
      errors.bathrooms = "Enter bathrooms";
    }
    if (!values.floor.trim()) errors.floor = "Enter floor";
    if (!values.furnishing.trim()) errors.furnishing = "Enter furnishing";
  }
  if (!values.description.trim()) errors.description = "Add description";
  return errors;
}

export function validateMedia(values: MediaState) {
  const errors: Partial<Record<"images", string>> = {};
  const hasImage = values.images.some((i) => Boolean(i.url?.trim()));
  if (!hasImage) {
    errors.images = "Add at least one image (upload files or paste an image URL).";
  }
  return errors;
}

export function validateAmenities() {
  return {} as Record<string, never>;
}

