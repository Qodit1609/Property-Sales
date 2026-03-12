import React from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import Wishlist from "../../components/buyer/Wishlist";

const BuyerWishlistPage: React.FC = () => {
  return (
    <BuyerLayout>
      <Wishlist />
    </BuyerLayout>
  );
};

export default BuyerWishlistPage;

