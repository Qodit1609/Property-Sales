import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchPropertyById } from "../../features/properties/propertySlice";
import PropertyPreview from "../../components/PropertyPreview/PropertyPreview";

const PropertyDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { selectedProperty, selectedLoading, selectedError } =
    useAppSelector((state) => state.properties);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }
  }, [dispatch, id]);

  if (selectedLoading) {
    return <div className="pt-24 text-center">Loading...</div>;
  }

  if (selectedError) {
    return (
      <div className="pt-24 text-center text-red-500">
        {selectedError}
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="pt-24 text-center">
        Property not found
      </div>
    );
  }

  return <PropertyPreview property={selectedProperty} />;
};

export default PropertyDetails;
