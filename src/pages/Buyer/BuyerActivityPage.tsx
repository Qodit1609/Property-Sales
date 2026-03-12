import React from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import ActivityHistory from "../../components/buyer/ActivityHistory";

const BuyerActivityPage: React.FC = () => {
  return (
    <BuyerLayout>
      <ActivityHistory />
    </BuyerLayout>
  );
};

export default BuyerActivityPage;

