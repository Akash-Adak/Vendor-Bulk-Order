// src/components/BulkOrderForm.js
import React, { useState } from 'react';
import '../css/bulkorder.css';

const BulkOrderForm = () => {
  const [vendorId, setVendorId] = useState('');
  const [orders, setOrders] = useState([{ item: '', quantity: '' }]);

  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][field] = value;
    setOrders(updatedOrders);
  };

  const handleAddOrder = () => {
    setOrders([...orders, { item: '', quantity: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log({ vendorId, orders });
  };

  return (
    <div className="bulk-form-container">
      <h2>Bulk Order Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Vendor ID"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        />
        {orders.map((order, index) => (
          <div key={index} className="order-row">
            <input
              type="text"
              placeholder="Item"
              value={order.item}
              onChange={(e) => handleOrderChange(index, 'item', e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={order.quantity}
              onChange={(e) => handleOrderChange(index, 'quantity', e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="add-btn" onClick={handleAddOrder}>+ Add Item</button>
        <button type="submit" className="submit-btn">Submit Order</button>
      </form>
    </div>
  );
};

export default BulkOrderForm;
