// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import BulkOrderPage from './pages/BulkOrderPage';
import MyOrdersPage from './pages/MyOrderPage'; // ✅ Fix typo (was MyOrderPage)
import SellerDashboard from './pages/SellerDashboard';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bulk-order" element={<BulkOrderPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
