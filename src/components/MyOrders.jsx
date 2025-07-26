// src/components/MyOrders.js
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../css/myorders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Logged in user:", user.uid);
      try {
        const querySnapshot = await getDocs(collection(db, "bulkOrders"));
        const allOrders = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Fetched Doc:", data);

          if (Array.isArray(data.orders)) {
            if (data.vendorId === user.uid) {
              allOrders.push(...data.orders);
            }
          }

        });

        console.log("Total orders for vendor:", allOrders);
        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No user logged in");
      setOrders([]);
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);


  return (
    <div className="orders-dashboard">
      {/* <h2>My Orders</h2> */}
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
                  <span className={`status ${order.status?.toLowerCase() || 'pending'}`}>
                    {order.status || 'Pending'}
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
