import React from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import NotificationPanel from "../../components/buyer/NotificationPanel";

const BuyerNotificationsPage: React.FC = () => {
  return (
    <BuyerLayout>
      <NotificationPanel />
    </BuyerLayout>
  );
};

export default BuyerNotificationsPage;

