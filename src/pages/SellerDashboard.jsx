import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import '../css/sellerDashboard.css';

const SellerDashboard = () => {
  // Store management state
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [materials, setMaterials] = useState([{ item: '', price: '', discount: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Analytics state
  const [stats, setStats] = useState({
    potentialOrders: 0,
    estimatedRevenue: 0,
    popularItems: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seller data and analytics
  useEffect(() => {
    const fetchData = async () => {
      const sellerId = auth.currentUser?.uid;
      if (!sellerId) return;

      try {
        // 1. Load seller's store info
        const storeDoc = await getDoc(doc(db, 'stores', sellerId));
        if (storeDoc.exists()) {
          const storeData = storeDoc.data();
          setStoreName(storeData.storeName || '');
          setLocation(storeData.location || { lat: '', lng: '' });
          setMaterials(storeData.materials || [{ item: '', price: '', discount: '' }]);

          // 2. Calculate analytics
          const ordersSnapshot = await getDocs(collection(db, 'bulkOrders'));
          calculateAnalytics(ordersSnapshot, storeData.materials);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    const calculateAnalytics = (ordersSnapshot, sellerItems) => {
      let potentialOrders = 0;
      let estimatedRevenue = 0;
      const itemCounts = {};

      ordersSnapshot.forEach(orderDoc => {
        const orderData = orderDoc.data();
        (orderData.orders || []).forEach(orderItem => {
          // Find matching item in seller's inventory
          const storeItem = sellerItems?.find(
            item => item.item.toLowerCase() === orderItem.item?.toLowerCase()
          );
          
          if (storeItem) {
            potentialOrders++;
            const quantity = Number(orderItem.quantity) || 0;
            estimatedRevenue += (storeItem.price || 0) * quantity;
            
            // Track popular items
            itemCounts[orderItem.item] = (itemCounts[orderItem.item] || 0) + quantity;
          }
        });
      });

      // Get top 3 popular items
      const popularItems = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([item, count]) => ({ item, count }));

      setStats({
        potentialOrders,
        estimatedRevenue,
        popularItems
      });
    };

    fetchData();
  }, []);

  // Store management handlers (unchanged from your original)
  const handleMaterialChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  const addMaterial = () => {
    setMaterials([...materials, { item: '', price: '', discount: '' }]);
  };

  const deleteMaterial = (index) => {
    const updated = materials.filter((_, i) => i !== index);
    setMaterials(updated);
  };

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6),
        });
      },
      (err) => {
        alert('Location permission denied or unavailable.');
        console.error(err);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const sellerId = auth.currentUser.uid;

    try {
      const docRef = doc(db, 'stores', sellerId);
      await setDoc(docRef, {
        sellerId,
        storeName: storeName.trim(),
        name: storeName.trim(),
        location: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
        },
        materials: materials.map(mat => ({
          item: mat.item.trim(),
          price: parseFloat(mat.price),
          discount: parseFloat(mat.discount),
        })),
        lastUpdated: new Date().toISOString()
      }, { merge: true }); // Added merge option to preserve existing fields
      alert('✅ Store data saved successfully!');
    } catch (err) {
      console.error('❌ Failed to save store:', err);
      alert('❌ Error saving store data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="seller-dashboard">
      <h2>🛒 Seller Dashboard</h2>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h3>Your Store Analytics</h3>
        <p className="disclaimer">
          Estimated from orders containing your inventory items
        </p>
        
        <div className="stats-summary">
          <div className="stat-card">
            <h4>Potential Orders</h4>
            <p>{stats.potentialOrders}</p>
            <small>Orders with your items</small>
          </div>
          <div className="stat-card">
            <h4>Estimated Revenue</h4>
            <p>₹{stats.estimatedRevenue.toLocaleString('en-IN')}</p>
            <small>Based on your prices</small>
          </div>
          <div className="stat-card">
            <h4>Popular Items</h4>
            <ul>
              {stats.popularItems.length > 0 ? (
                stats.popularItems.map((item, i) => (
                  <li key={i}>
                    {item.item} <span>({item.count})</span>
                  </li>
                ))
              ) : (
                <li>No data yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Store Management Form */}
      <div className="store-management">
        <h3>Manage Your Store</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <div className="location-fields">
              <input
                type="number"
                placeholder="Latitude"
                value={location.lat}
                onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                required
                step="any"
              />
              <input
                type="number"
                placeholder="Longitude"
                value={location.lng}
                onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                required
                step="any"
              />
              <button 
                type="button" 
                onClick={useCurrentLocation}
                className="location-btn"
              >
                📍 Use My Location
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Inventory Items</label>
            {materials.map((mat, i) => (
              <div key={i} className="material-row">
                <input
                  type="text"
                  placeholder="Item name"
                  value={mat.item}
                  onChange={(e) => handleMaterialChange(i, 'item', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={mat.price}
                  onChange={(e) => handleMaterialChange(i, 'price', e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={mat.discount}
                  onChange={(e) => handleMaterialChange(i, 'discount', e.target.value)}
                  min="0"
                  max="100"
                />
                {materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteMaterial(i)}
                    className="delete-btn"
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMaterial}
              className="add-btn"
            >
              + Add Item
            </button>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Store Info'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerDashboard;