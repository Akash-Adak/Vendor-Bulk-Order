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
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!userData?.uid) return;

      try {
        setLoading(true);
        setError(null);
        
        const ordersRef = collection(db, "bulkOrders");
        const q = query(ordersRef, where("vendorId", "==", userData.uid));
        const querySnapshot = await getDocs(q);

        let totalOrdersCount = 0;       // Renamed for clarity
        let pendingOrdersCount = 0;     // Renamed for clarity
        let totalRevenueValue = 0;      // Renamed for clarity

        // Process each order document
        querySnapshot.forEach((doc) => {
          totalOrdersCount++; // Count each order document (1 document = 1 order)
          
          const data = doc.data();
          const ordersArray = data.orders || [];
          
          // Check if ANY item in the order is pending (order-level status)
          if (ordersArray.some(order => order.status === "Pending")) {
            pendingOrdersCount++;
          }

          // Calculate revenue from all items in the order
          ordersArray.forEach((order) => {
            if (order.price && order.quantity) {
              totalRevenueValue += Number(order.price) * Number(order.quantity);
            }
          });
        });

        setTotalOrders(totalOrdersCount);
        setPendingOrders(pendingOrdersCount);
        setRevenue(totalRevenueValue);

      } catch (err) {
        console.error("Failed to fetch orders: ", err);
        setError("Failed to load order data"); // Set error message
      } finally {
        setLoading(false); // Ensure loading stops even if error occurs
      }
    };

    fetchOrderData();
  }, [userData]);

  return (
    <div className="vendor-dashboard">
      {/* Main Content */}
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
            {/* Total Orders Card */}
            <div className="card green">
              <h3>Total Orders</h3>
              <p>{totalOrders.toLocaleString()}</p> {/* Added formatting */}
              <small>Number of orders placed</small> {/* Added helper text */}
            </div>
            
            {/* Pending Orders Card */}
            <div className="card yellow">
              <h3>Pending Orders</h3>
              <p>{pendingOrders.toLocaleString()}</p> {/* Added formatting */}
              <small>Awaiting fulfillment</small> {/* Added helper text */}
            </div>
            
            {/* Revenue Card - Changed label to "Sales Value" */}
            <div className="card blue">
              <h3>Sales Value</h3> {/* More accurate than "Revenue" */}
              <p>₹{revenue.toLocaleString('en-IN')}</p> {/* Proper INR formatting */}
              <small>Total order value</small> {/* Added helper text */}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;