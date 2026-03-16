import React from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import CompareTable from "../../components/buyer/CompareTable";

const BuyerComparePage: React.FC = () => {
  return (
    <BuyerLayout>
      <CompareTable />
    </BuyerLayout>
  );
};

export default BuyerComparePage;

