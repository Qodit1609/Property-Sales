import React from "react";
import BuyerLayout from "../../components/buyer/BuyerLayout";
import AccountPanel from "../../components/buyer/AccountPanel";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { updatePreferences } from "../../features/buyer/buyerSlice";

const BuyerAccountPage: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <BuyerLayout>
      <div className="space-y-5">
        <AccountPanel
          onUpdatePreferences={(prefs) => dispatch(updatePreferences(prefs))}
        />
      </div>
    </BuyerLayout>
  );
};

export default BuyerAccountPage;

