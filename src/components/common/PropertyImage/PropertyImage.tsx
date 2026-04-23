import { useState } from "react";
import { FALLBACK_PROPERTY_IMAGE } from "../../../utils/propertyFormatters";

type PropertyImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: "lazy" | "eager";
};

const PropertyImage = ({
  src,
  alt,
  className = "",
  fallback = FALLBACK_PROPERTY_IMAGE,
  loading = "lazy",
}: PropertyImageProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? fallback : src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export default PropertyImage;
