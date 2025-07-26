import React from "react";
import { useAuth } from "../hooks/useAuth";

const VendorDashboard = () => {
  const { userData } = useAuth();

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">Welcome, Vendor {userData?.email || "!"}</h1>
      <p className="mt-2">Here you can manage your bulk orders and track sales.</p>
    </div>
  );
};

export default VendorDashboard;
