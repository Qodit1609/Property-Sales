import React from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import Cart from "../../components/buyer/Cart";

const BuyerCartPage: React.FC = () => {
  return (
    <BuyerLayout>
      <Cart />
    </BuyerLayout>
  );
};

export default BuyerCartPage;

