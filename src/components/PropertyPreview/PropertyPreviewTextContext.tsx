import { createContext, useContext, type ReactNode } from "react";
import type { Property } from "../../features/properties/propertyType";
import {
  usePropertyPreviewText,
  type PropertyPreviewText,
} from "../../hooks/usePropertyPreviewText";

const PropertyPreviewTextContext = createContext<PropertyPreviewText | null>(null);

type ProviderProps = {
  property: Property;
  children: ReactNode;
};

export const PropertyPreviewTextProvider = ({ property, children }: ProviderProps) => {
  const text = usePropertyPreviewText(property);
  return (
    <PropertyPreviewTextContext.Provider value={text}>
      {children}
    </PropertyPreviewTextContext.Provider>
  );
};

export const usePropertyPreviewTextContext = (): PropertyPreviewText => {
  const context = useContext(PropertyPreviewTextContext);
  if (!context) {
    throw new Error("usePropertyPreviewTextContext must be used within PropertyPreviewTextProvider");
  }
  return context;
};
