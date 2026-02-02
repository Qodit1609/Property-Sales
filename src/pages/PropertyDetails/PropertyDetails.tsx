import { useParams } from "react-router-dom";
import PropertyPreview from "../../components/PropertyPreview/PropertyPreview";

const PropertyDetails = () => {
  const { id } = useParams();

  return (
    <PropertyPreview
      id={Number(id)}
      title="Abbey Mill Place"
      address="Station Road, Bishops Waltham, Southampton, SO32 1DH"
      priceRange="£525,000 - £575,000"
      images={[
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      ]}
      mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2494.522915889845!2d-1.2293!3d50.9553"
      videoUrl="https://www.w3schools.com/html/mov_bbb.mp4"
      agent={{
        name: "Nikki Houston",
        location: "Winchester",
        phone: "+44 (0) 1962 834 045",
        image:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
      }}
    />
  );
};

export default PropertyDetails;
