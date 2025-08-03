// src/components/NearbyStores.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'; // ADDED: Import useAuth hook
import '../css/NearbyStores.css';

const PEXELS_API_KEY = '4zku6FCJ44pQzFwLc5oJ3xrsyGnGUISuesAyM99dhYfTXQigACES1NSF';

const NearbyStores = () => {
  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [images, setImages] = useState({});
  const [quantities, setQuantities] = useState({}); // ✅ hold quantity per material-store combo
  const { userData } = useAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setError('❌ Location access denied.')
    );
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      const querySnapshot = await getDocs(collection(db, 'stores'));
      const storeList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const distance = location ? haversine(location, data.location) : null;
        storeList.push({ ...data, distance });
      });

      storeList.sort((a, b) => a.distance - b.distance);
      setStores(storeList);

      storeList.forEach((store) => {
        store.materials.forEach(async (mat) => {
          if (!images[mat.item]) {
            const img = await fetchImage(mat.item);
            setImages((prev) => ({ ...prev, [mat.item]: img }));
          }
        });
      });
    };

    if (location) fetchStores();
  }, [location]);

  const haversine = (loc1, loc2) => {
    const R = 6371;
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchImage = async (query) => {
    try {
      const res = await axios.get('https://api.pexels.com/v1/search', {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        params: {
          query,
          per_page: 1,
        },
      });

      return res.data.photos?.[0]?.src.medium || '';
    } catch (error) {
      console.error('Image fetch error:', error);
      return '';
    }
  };

  const handleQuantityChange = (key, value) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: parseInt(value) || 1,
    }));
  };

  const handleOrder = async (material, store) => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        alert('Please login to place an order.');
        return;
      }

      const key = `${store.storeId || store.id}-${material.item}`;
      const quantity = quantities[key] || 1;

      const orderData = {
        item: material.item,
        quantity,
        price: material.price,
        storeName: store.storeName || 'Unnamed Store',
        storeId: store.storeId || store.id || 'unknown',
        sellerId: store.sellerId || 'unknown',
        status: 'Pending',
      };

      await addDoc(collection(db, 'bulkOrders'), {
        vendorId: user.uid,
        vendorEmail: user.email,
        orders: [orderData],
        createdAt: serverTimestamp(),
      });

      alert(`✅ Order placed for ${material.item} (Qty: ${quantity}) successfully!`);
      setQuantities({});
    } catch (err) {
      console.error('Order failed:', err);
      alert('❌ Failed to place order.');
    }
  };

  return (
    <div className="nearby-stores">
      <h2>🛒 Nearby Sellers & Price Comparison</h2>
      {error && <p className="error">{error}</p>}
      {stores.map((store, idx) => (
        <div className="store-card" key={idx}>
          <div className="store-header">
          <h3 className="store-name">{store.name}</h3>
          <p className="distance">📍 {store.distance?.toFixed(2)} km away</p>
          </div>
          <div className="product-list">
            {store.materials.map((mat, i) => {
              const key = `${store.storeId || store.id}-${mat.item}`;
              return (
                <div className="product-card" key={i}>
                  <img
                    src={images[mat.item] || 'https://via.placeholder.com/150'}
                    alt={mat.item}
                    className="product-image"
                  />
                  <div className="product-details">
                    <strong>{mat.item}</strong>
                    <p>₹{mat.price}/kg</p>
                    {userData?.role !== 'seller' && (
                      <>
                        <div className="quantity-wrapper">
                          <input
                            type="number"
                            placeholder="Quantity"
                            min="1"
                            value={quantities[key] || ''}
                            onChange={(e) => handleQuantityChange(key, e.target.value)}
                            className="quantity-input"
                          />
                        </div>
                        <button 
                          onClick={() => handleOrder(mat, store)} 
                          className="order-btn"
                        >
                          Place Order
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbyStores;
