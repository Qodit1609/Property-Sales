import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Reuse existing post property flow without changing it.
 */
const AgentAddPropertyPage: React.FC = () => {
  return <Navigate to="/post-property/basic" replace />;
};

export default AgentAddPropertyPage;

