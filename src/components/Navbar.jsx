import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import "../css/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="logo">BulkBuddy</h1>
      </div>
      
      {/* Hamburger menu toggle - only visible on mobile */}
      <div 
        className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        {userData?.role === "vendor" && (
          <>
            <li><Link to="/bulk-order" onClick={() => setIsMenuOpen(false)}>Place Order</Link></li>
            <li><Link to="/my-orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link></li>
            <li><Link to="/vendor-dashboard" onClick={() => setIsMenuOpen(false)}>Vendor Dashboard</Link></li>
            <li><Link to="/nearby" onClick={() => setIsMenuOpen(false)}>Nearby Stores</Link></li>
          </>
        )}
        {userData?.role === "seller" && (
          <>
            <li><Link to="/seller-dashboard" onClick={() => setIsMenuOpen(false)}>Seller Panel</Link></li>
            <li><Link to="/seller-orders" onClick={() => setIsMenuOpen(false)}>Seller Orders</Link></li>
          </>
        )}
        {!user ? (
          <>
            <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
            <li><Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link></li>
          </>
        ) : (
          <li>
            <button className="logout-btn" onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;