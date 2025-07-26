// src/components/BulkOrderForm.js
import React, { useState } from 'react';
import { db } from '../firebase'; // Make sure this is correctly imported
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import '../css/bulkorder.css';

const BulkOrderForm = () => {
  const { currentUser, role } = useAuth(); // Get current logged-in user
  const [orders, setOrders] = useState([{ item: '', quantity: '' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][field] = value;
    setOrders(updatedOrders);
  };

  const handleAddOrder = () => {
    setOrders([...orders, { item: '', quantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || role !== 'vendor') {
      setMessage('Only vendors can place bulk orders.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'bulkOrders'), {
        vendorId: currentUser.uid,
        vendorEmail: currentUser.email,
        orders,
        createdAt: Timestamp.now(),
      });

      setMessage('✅ Order placed successfully!');
      setOrders([{ item: '', quantity: '' }]); // Clear form
    } catch (error) {
      console.error('Error submitting order:', error);
      setMessage('❌ Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-form-container">
      <h2>Bulk Order Form</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        {orders.map((order, index) => (
          <div key={index} className="order-row">
            <input
              type="text"
              placeholder="Item"
              value={order.item}
              onChange={(e) => handleOrderChange(index, 'item', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={order.quantity}
              onChange={(e) => handleOrderChange(index, 'quantity', e.target.value)}
              required
              min="1"
            />
          </div>
        ))}
        <button type="button" className="add-btn" onClick={handleAddOrder}>+ Add Item</button>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};

export default BulkOrderForm;
