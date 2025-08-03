import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import "../css/VendorDashboard.css";
import { FaBoxOpen, FaChartLine, FaSignOutAlt } from "react-icons/fa";

const VendorDashboard = () => {
  const { userData } = useAuth();
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!userData?.uid) return;

      try {
        setLoading(true);
        setError(null);
        
        const ordersRef = collection(db, "bulkOrders");
        const q = query(ordersRef, where("vendorId", "==", userData.uid));
        const querySnapshot = await getDocs(q);

        let totalOrdersCount = 0;
        let pendingOrdersCount = 0;
        let totalRevenueValue = 0;
        let totalItemsCount = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const ordersArray = data.orders || [];
          
          // Count all items across all orders
          totalItemsCount += ordersArray.length;
          
          // Calculate metrics per item (matching MyOrders.jsx structure)
          ordersArray.forEach((order) => {
            // Count pending items (not orders)
            if (!order.status || order.status === "Pending") {
              pendingOrdersCount++;
            }
            
            // Calculate revenue
            if (order.price && order.quantity) {
              totalRevenueValue += Number(order.price) * Number(order.quantity);
            }
          });
          
          // Count each document as one order
          totalOrdersCount++;
        });

        setTotalOrders(totalItemsCount); // Changed to show total items
        setPendingOrders(pendingOrdersCount);
        setRevenue(totalRevenueValue);

      } catch (err) {
        console.error("Failed to fetch orders: ", err);
        setError("Failed to load order data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [userData]);

  return (
    <div className="vendor-dashboard">
      <main className="main-content">
        <div className="welcome-box">
          <h1>Welcome, Vendor {userData?.email || "!"}</h1>
          <p>Here you can manage your bulk orders and track sales performance.</p>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="summary">
            <div className="card green">
              <h3>Total Items Ordered</h3> {/* Updated label */}
              <p>{totalOrders.toLocaleString()}</p>
              <small>Across all orders</small> {/* Updated helper text */}
            </div>
            
            <div className="card yellow">
              <h3>Pending Items</h3> {/* Updated label */}
              <p>{pendingOrders.toLocaleString()}</p>
              <small>Awaiting fulfillment</small>
            </div>
            
            <div className="card blue">
              <h3>Sales Value</h3>
              <p>₹{revenue.toLocaleString('en-IN')}</p>
              <small>Total order value</small>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;