// src/components/Hero.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Import your auth hook
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../css/hero.css';
import illustration from '../assets/bulk-order-hero.avif';

const Hero = () => {
  const { user } = useAuth(); // Get current user
  const navigate = useNavigate();

  // Handle protected route access
  const handleProtectedClick = (path) => {
    if (!user) {
      toast.error('Please login to access this feature');
      return;
    }
    navigate(path);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>BulkBuddy</h1>
        <p>Your smart solution for bulk ordering and local sourcing.</p>
        <div className="buttons">
          <button 
            onClick={() => handleProtectedClick('/bulk-order')} 
            className="btn btn-primary"
          >
            Place Order
          </button>
          <button 
            onClick={() => handleProtectedClick('/nearby')} 
            className="btn btn-secondary"
          >
            Nearby Sellers
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img src={illustration} alt="Bulk order illustration" />
      </div>
    </section>
  );
};

export default Hero;