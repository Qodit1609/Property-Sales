import { useEffect, useMemo, useRef, useState } from "react";
import { fetchPropertyByIdAPI } from "../features/properties/propertyAPI";
import type { Property } from "../features/properties/propertyType";
import { useAppSelector } from "./reduxHooks";
import {
  mergeMetaIntoProperty,
  metaToFallbackProperty,
} from "../features/buyer/buyerSelectors";

/**
 * Resolves ordered properties for buyer lists using Redux catalog + detail + API
 * without writing into `propertySlice` (avoids clobbering PropertyDetails).
 */
export function useBuyerResolvedProperties(ids: string[]) {
  const catalog = useAppSelector((s) => s.properties.data);
  const selectedProperty = useAppSelector((s) => s.properties.selectedProperty);
  const entities = useAppSelector((s) => s.buyer.entities);

  const [extra, setExtra] = useState<Record<string, Property>>({});
  const fetching = useRef<Set<string>>(new Set());

  const catalogMap = useMemo(() => {
    const m: Record<string, Property> = {};
    catalog.forEach((p) => {
      m[p._id] = p;
    });
    return m;
  }, [catalog]);

  useEffect(() => {
    for (const id of ids) {
      if (catalogMap[id] || selectedProperty?._id === id || extra[id]) continue;
      if (fetching.current.has(id)) continue;
      fetching.current.add(id);
      fetchPropertyByIdAPI(id)
        .then((p) => {
          setExtra((prev) => ({ ...prev, [p._id]: p }));
        })
        .catch(() => {
          /* meta fallback may still render */
        })
        .finally(() => {
          fetching.current.delete(id);
        });
    }
  }, [ids, catalogMap, selectedProperty, extra]);

  const properties = useMemo(() => {
    return ids
      .map((id) => {
        let p: Property | null | undefined =
          catalogMap[id] ??
          (selectedProperty?._id === id ? selectedProperty : undefined) ??
          extra[id];
        if (!p) {
          const fb = metaToFallbackProperty(id, entities);
          p = fb;
        }
        return p ? mergeMetaIntoProperty(p, entities) : null;
      })
      .filter((p): p is Property => p != null);
  }, [ids, catalogMap, selectedProperty, extra, entities]);

  const loading = useMemo(() => {
    return ids.some((id) => {
      if (catalogMap[id] || selectedProperty?._id === id || extra[id]) return false;
      if (metaToFallbackProperty(id, entities)) return false;
      return true;
    });
  }, [ids, catalogMap, selectedProperty, extra, entities]);

  return { properties, loading };
}
