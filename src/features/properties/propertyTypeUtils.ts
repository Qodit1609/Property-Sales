const normalizeType = (value: string | undefined): string => {
  if (!value) {
    return "";
  }
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
};

export const isFarmhouseType = (propertyType: string | undefined): boolean => {
  const normalized = normalizeType(propertyType);
  return normalized.includes("farmhouse") || normalized === "farmland";
};

export const isAgricultureLandType = (propertyType: string | undefined): boolean => {
  const normalized = normalizeType(propertyType);
  return (
    normalized.includes("agricultureland") ||
    normalized.includes("agriculturalland") ||
    normalized.includes("farmland") ||
    normalized.includes("farmlandplot") ||
    normalized === "agri"
  );
};

export const isResortType = (propertyType: string | undefined): boolean => {
  const normalized = normalizeType(propertyType);
  return normalized.includes("resort");
};

export const isRentFarmhouseType = (propertyType: string | undefined): boolean => {
  const normalized = normalizeType(propertyType);
  return (
    normalized.includes("rentfarmhouse") ||
    normalized.includes("farmhouserent") ||
    normalized.includes("rentalfarmhouse")
  );
};
