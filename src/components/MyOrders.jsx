// src/components/MyOrders.js
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../css/myorders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(
            collection(db, "orders"),
            where("vendorId", "==", user.uid)
          );

          const querySnapshot = await getDocs(q);
          const fetchedOrders = querySnapshot.docs.map((doc) => doc.data());
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <div className="orders-dashboard">
      <h2>My Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="empty">No orders placed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td>{order.item}</td>
                <td>{order.quantity}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
