// components/Hero.js
import React from 'react';
import '../css/hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <h1>Connect with Local Suppliers</h1>
      <p>Get the best prices for daily-use raw materials near you. Built for street vendors to order in bulk with ease.</p>
      <a href="/bulk-order" className="cta-btn">Start Ordering</a>
    </section>
  );
};

export default Hero;
