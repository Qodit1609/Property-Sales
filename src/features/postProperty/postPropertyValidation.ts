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
  if (!values.listingType) errors.listingType = "postProperty.validation.selectListingType";
  if (!values.category) errors.category = "postProperty.validation.selectCategory";
  if (!values.propertyType) errors.propertyType = "postProperty.validation.selectPropertyType";
  if (!values.title.trim()) errors.title = "postProperty.validation.enterTitle";
  if (!values.contactName.trim()) errors.contactName = "postProperty.validation.enterContactName";
  if (!values.contactEmail.trim()) errors.contactEmail = "postProperty.validation.enterEmail";
  if (!values.contactMobile.trim()) errors.contactMobile = "postProperty.validation.enterMobileNumber";
  return errors;
}

export function validateLocationDetails(values: LocationDetails) {
  const errors: ValidationErrors<LocationDetails> = {};
  if (!values.state.trim()) errors.state = "postProperty.validation.stateRequired";
  if (!values.city.trim()) errors.city = "postProperty.validation.cityRequired";
  if (!values.tehsil.trim()) errors.tehsil = "postProperty.validation.tehsilRequired";
  if (!values.village.trim()) errors.village = "postProperty.validation.villageRequired";
  if (!values.locality.trim()) errors.locality = "postProperty.validation.localityRequired";
  if (!values.pinCode.trim()) errors.pinCode = "postProperty.validation.pinCodeRequired";
  // survey number is important for agriculture land; handled in UI depending on category
  return errors;
}

export function validateProfileDetails(
  values: ProfileDetails,
  basicDetails?: BasicDetails
) {
  const errors: ValidationErrors<ProfileDetails> = {};
  if (values.totalArea == null || Number.isNaN(values.totalArea) || values.totalArea <= 0) {
    errors.totalArea = "postProperty.validation.enterTotalArea";
  }
  if (values.price == null || Number.isNaN(values.price) || values.price <= 0) {
    errors.price = "postProperty.validation.enterPrice";
  }
  if (!values.ownershipType) errors.ownershipType = "postProperty.validation.selectOwnershipType";
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
      errors.bedrooms = "postProperty.validation.enterBedrooms";
    }
    if (
      values.bathrooms == null ||
      Number.isNaN(values.bathrooms) ||
      values.bathrooms < 0
    ) {
      errors.bathrooms = "postProperty.validation.enterBathrooms";
    }
    if (!values.floor.trim()) errors.floor = "postProperty.validation.enterFloor";
    if (!values.furnishing.trim()) errors.furnishing = "postProperty.validation.enterFurnishing";
  }
  if (!values.description.trim()) errors.description = "postProperty.validation.addDescription";
  return errors;
}

export function validateMedia(values: MediaState) {
  const errors: Partial<Record<"images", string>> = {};
  const hasImage = values.images.some((i) => Boolean(i.url?.trim()));
  if (!hasImage) {
    errors.images = "postProperty.validation.addAtLeastOneImage";
  }
  return errors;
}

export function validateAmenities() {
  return {} as Record<string, never>;
}

