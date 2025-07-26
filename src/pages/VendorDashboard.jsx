import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Make sure this points to your firebase config
import "../css/VendorDashboard.css";
import { FaBoxOpen, FaChartLine, FaSignOutAlt } from "react-icons/fa";

const VendorDashboard = () => {
  const { userData } = useAuth();
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
  const fetchOrderData = async () => {
    if (!userData?.uid) return;

    try {
      const ordersRef = collection(db, "bulkOrders");
      const q = query(ordersRef, where("vendorId", "==", userData.uid));
      const querySnapshot = await getDocs(q);

      let total = 0;
      let pending = 0;
      let totalRevenue = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const ordersArray = data.orders || [];

        ordersArray.forEach((order) => {
          total += Number(order.quantity || 0);

          if (order.status === "Pending") pending++;

          if (order.price && order.quantity) {
            totalRevenue += Number(order.price) * Number(order.quantity);
          }
        });
      });

      setTotalOrders(total);
      setPendingOrders(pending);
      setRevenue(totalRevenue);
    } catch (err) {
      console.error("Failed to fetch orders: ", err);
    }
  };

  fetchOrderData();
}, [userData]);


  return (
    <div className="vendor-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">BulkBuddy</h2>
        <nav className="nav-links">
          <a href="/my-orders"><FaBoxOpen /> My Orders</a>
          <a href="/analytics"><FaChartLine /> Analytics</a>
          <a href="/logout" className="logout"><FaSignOutAlt /> Logout</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-box">
          <h1>Welcome, Vendor {userData?.email || "!"}</h1>
          <p>Here you can manage your bulk orders and track sales performance.</p>
        </div>

        <div className="summary">
          <div className="card green">
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="card yellow">
            <h3>Pending Orders</h3>
            <p>{pendingOrders}</p>
          </div>
          <div className="card blue">
            <h3>Revenue</h3>
            <p>₹{revenue.toLocaleString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
