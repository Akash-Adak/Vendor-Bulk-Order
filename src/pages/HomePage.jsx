// pages/HomePage.js
import React from "react";
import Hero from "../components/Hero";
import "../css/HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <Hero />

      {/* Features Section */}
      <section className="features">
        <h2>Why BulkBuddy?</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Bulk Savings</h3>
            <p>Order raw materials in bulk at discounted prices directly from sellers.</p>
          </div>
          <div className="card">
            <h3>Local Discovery</h3>
            <p>Find nearby sellers to reduce delivery time and costs.</p>
          </div>
          <div className="card">
            <h3>Order Tracking</h3>
            <p>Vendors can easily track, manage, and complete their orders.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li><strong>Login:</strong> Vendor or Seller logs in to the platform.</li>
          <li><strong>Place/Receive Orders:</strong> Vendors place bulk orders; Sellers get requests.</li>
          <li><strong>Delivery:</strong> Seller delivers within a given time, vendor confirms completion.</li>
        </ol>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial">
            <p>"BulkBuddy helped me cut my costs by 30%. Highly recommended!"</p>
            <span>- Ramesh, Street Vendor</span>
          </div>
          <div className="testimonial">
            <p>"Finally a platform that supports local sellers. Great experience!"</p>
            <span>- Priya, Raw Material Seller</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} BulkBuddy • Made with ❤️ for street food heroes</p>
      </footer>
    </div>
  );
};

export default HomePage;
