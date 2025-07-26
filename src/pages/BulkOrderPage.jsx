import React from "react";
import BulkOrderForm from "../components/BulkOrderForm";
import { useAuth } from "../context/AuthContext";

const BulkOrderPage = () => {
  const { role } = useAuth();

  if (role === "seller") {
    return <p className="text-red-500 p-4">Sellers cannot place orders.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Place Bulk Order</h2>
      <BulkOrderForm />
    </div>
  );
};

export default BulkOrderPage;
