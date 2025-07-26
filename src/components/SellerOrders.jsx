// src/components/SellerOrders.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import '../css/SellerOrders.css';

const SellerOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  // Fetch orders for this seller
  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(collection(db, 'bulkOrders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = [];

      snapshot.forEach((docSnap) => {
        const docData = docSnap.data();
  console.log(docData);
        if (!Array.isArray(docData.orders)) return;

        const matchingOrders = docData.orders
          .map((order, idx) => ({
            ...order,
            parentId: docSnap.id,
            orderIndex: idx,
          }))
         
          .filter((order) => order.sellerId === currentUser.uid);
  console.log(matchingOrders);
        allOrders.push(...matchingOrders);
      });

      setOrders(allOrders);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Accept order
  const acceptOrder = async (parentId, orderIndex) => {
    const docRef = doc(db, 'bulkOrders', parentId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const ordersCopy = [...data.orders];

    const deadline = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now
    ordersCopy[orderIndex].status = 'Accepted';
    ordersCopy[orderIndex].deliveryDeadline = deadline;

    await updateDoc(docRef, { orders: ordersCopy });
  };

  // Auto-complete orders
  const checkForCompletion = async () => {
    const now = new Date();
    const q = query(collection(db, 'bulkOrders'));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      let updated = false;

      const ordersCopy = data.orders.map((order) => {
        if (
          order.status === 'Accepted' &&
          order.deliveryDeadline &&
          new Date(order.deliveryDeadline.seconds * 1000) <= now
        ) {
          updated = true;
          return { ...order, status: 'Completed' };
        }
        return order;
      });

      if (updated) {
        await updateDoc(doc(db, 'bulkOrders', docSnap.id), {
          orders: ordersCopy,
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkForCompletion, 30000); // every 30 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="seller-orders-container">
      <h2 className="section-title">📦 Seller Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet for your store.</p>
      ) : (
        orders.map((order, idx) => (
          <div className="order-card" key={idx}>
            <p><strong>Item:</strong> {order.item}</p>
            <p><strong>Price:</strong> ₹{order.price}</p>
            <p><strong>Status:</strong> {order.status}</p>
            {order.status === 'Accepted' && order.deliveryDeadline && (
              <p><strong>Delivery in:</strong> {formatDistanceToNow(new Date(order.deliveryDeadline.seconds * 1000), { addSuffix: true })}</p>
            )}
            {order.status === 'Pending' && (
              <button className="accept-btn" onClick={() => acceptOrder(order.parentId, order.orderIndex)}>
                Accept Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrders;
