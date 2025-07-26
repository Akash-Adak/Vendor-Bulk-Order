import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth"; // Assumes you have this custom hook
import "../css/Navbar.css"; // Custom CSS

const Navbar = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/");
    } catch (err) {
      alert("Logout failed");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">BulkBuddy</h1>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {userData?.role === "vendor" && (
          <>
            <li><Link to="/bulk-order">Place Order</Link></li>
            <li><Link to="/my-orders">My Orders</Link></li>
            <li><Link to="/vendor-dashboard">Vendor Dashboard</Link></li>
            <li><Link to="/nearby">Nearby Stores</Link></li>

          </>
        )}
        {userData?.role === "seller" && (
          <>
        <li><Link to="/seller-dashboard">Seller Panel</Link></li>
        <li><Link to="/seller-orders">Seller Orders</Link></li>

          </>
        )}
        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        ) : (
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
