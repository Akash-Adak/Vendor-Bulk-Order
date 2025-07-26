import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">BulkBuddy</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/bulk-order">Place Order</Link></li>
        <li><Link to="/my-orders">My Orders</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
