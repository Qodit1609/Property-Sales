import React from "react";
import SellerShellLayout from "./SellerShellLayout";

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  return <SellerShellLayout>{children}</SellerShellLayout>;
};

export default SellerLayout;
