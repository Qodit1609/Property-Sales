import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchPropertyById } from "../../features/properties/propertySlice";
import { recordPropertyView } from "../../features/buyer/buyerSlice";
import PropertyPreview, {
  PropertyPreviewSkeleton,
} from "../../components/PropertyPreview/PropertyPreview";
import { Button } from "@/components/common";

const ADMIN_VIEWED_STORAGE_KEY = "admin_viewed_property_ids";

const PropertyDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { selectedProperty, selectedLoading, selectedError } =
    useAppSelector((state) => state.properties);
  const isBuyer = useAppSelector((state) => state.auth.user?.role === "buyer");
  const isAdmin = useAppSelector((state) => state.auth.user?.role === "admin");

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!isBuyer) return;
    if (selectedProperty && id && selectedProperty._id === id) {
      dispatch(recordPropertyView(selectedProperty));
    }
  }, [dispatch, selectedProperty, id, isBuyer]);

  useEffect(() => {
    if (!isAdmin || !id || !selectedProperty || selectedProperty._id !== id) return;
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(ADMIN_VIEWED_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];
      const ids = Array.isArray(parsed)
        ? parsed.map((value) => String(value))
        : [];
      if (ids.includes(id)) return;
      window.sessionStorage.setItem(
        ADMIN_VIEWED_STORAGE_KEY,
        JSON.stringify([...ids, id])
      );
    } catch {
      // Avoid blocking details render on storage parse issues.
    }
  }, [isAdmin, id, selectedProperty]);

  if (selectedLoading) {
    return <PropertyPreviewSkeleton />;
  }

  if (selectedError) {
    return (
      <div className="pt-24 px-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-semibold text-red-700">
            Unable to load property details
          </p>
          <p className="mt-2 text-sm text-red-600">{selectedError}</p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[var(--b1)] text-[var(--fg)]"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="pt-24 px-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-[var(--b2-soft)] bg-white p-6 text-center">
          <p className="text-lg font-semibold text-[var(--b1)]">
            Property not found
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            The property may have been removed or is unavailable.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-4 bg-[var(--b1)] text-[var(--fg)]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return <PropertyPreview property={selectedProperty} />;
};

export default PropertyDetails;
