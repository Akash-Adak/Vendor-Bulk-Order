import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children, role }) => {
  const { user, userData } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (role && userData?.role !== role) return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;
