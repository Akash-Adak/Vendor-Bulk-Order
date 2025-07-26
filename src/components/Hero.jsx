// src/components/Hero.jsx
import React from 'react';
import '../css/Hero.css';
import illustration from '../assets/bulk-order-hero.avif'; // or use above free image link

const Hero = () => (
  <section className="hero">
    <div className="hero-content">
      <h1>BulkBuddy</h1>
      <p>Your smart solution for bulk ordering and local sourcing.</p>
      <div className="buttons">
        <a href="/bulk-order" className="btn btn-primary">Place Order</a>
        <a href="/nearby" className="btn btn-secondary">Nearby Sellers</a>
      </div>
    </div>
    <div className="hero-image">
      <img src={illustration} alt="Bulk order illustration" />
    </div>
  </section>
);

export default Hero;
