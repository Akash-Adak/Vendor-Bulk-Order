// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import BulkOrderPage from './pages/BulkOrderPage';
import MyOrdersPage from './pages/MyOrderPage'; // ✅ Fix typo (was MyOrderPage)
import SellerDashboard from './pages/SellerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { Toaster } from "react-hot-toast";
import SellerOrders from "./components/SellerOrders";
import NearbyStores from "./components/NearbyStores";
import SellerStorePage from "./pages/SellerStorePage";
function App() {
  return (
    <>
       <Toaster position="top-center" />
       <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bulk-order" element={<BulkOrderPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/nearby" element={<NearbyStores />} />
           <Route path="/vendor-dashboard" element={ <VendorDashboard /> } />
       <Route path="/seller-orders" element={ <SellerOrders /> } />
          <Route path="/seller-dashboard" element={<SellerDashboard /> } />
                  <Route path="/seller-product" element={<SellerStorePage /> } />   
      </Routes>
    </Router>
    </>
    
  );
}

export default App;
