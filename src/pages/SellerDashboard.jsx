import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../css/sellerDashboard.css';

const SellerDashboard = () => {
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [materials, setMaterials] = useState([{ item: '', price: '', discount: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const docSnap = await getDoc(docRef);

      let existingMaterials = [];
      if (docSnap.exists()) {
        const data = docSnap.data();
        existingMaterials = data.materials || [];
      }

      const newMaterials = materials.map((mat) => ({
        item: mat.item.trim(),
        price: parseFloat(mat.price),
        discount: parseFloat(mat.discount),
      }));

      // Remove duplicates based on item name (case insensitive)
      const combinedMaterials = [
        ...existingMaterials.filter(
          (oldItem) =>
            !newMaterials.some(
              (newItem) => newItem.item.toLowerCase() === oldItem.item.toLowerCase()
            )
        ),
        ...newMaterials,
      ];

      const storeData = {
        sellerId,
        name: storeName,
        location: {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lng),
        },
        imageUrl: '', // Not required anymore
        materials: combinedMaterials,
      };

      await setDoc(docRef, storeData);
      alert('✅ Store data saved successfully!');
    } catch (err) {
      console.error('❌ Failed to save store:', err);
      alert('❌ Error saving store data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averagePrice = () => {
    const prices = materials.map((m) => parseFloat(m.price) || 0);
    const total = prices.reduce((sum, p) => sum + p, 0);
    return prices.length > 0 ? (total / prices.length).toFixed(2) : 0;
  };

  return (
    <div className="seller-dashboard">
      <h2>🛒 Seller Store Manager</h2>

      <div className="summary-box">
        <p><strong>Total Items:</strong> {materials.length}</p>
        <p><strong>Average Price:</strong> ₹{averagePrice()}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />

        <div className="location-fields">
          <input
            type="number"
            placeholder="Latitude"
            value={location.lat}
            onChange={(e) => setLocation({ ...location, lat: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Longitude"
            value={location.lng}
            onChange={(e) => setLocation({ ...location, lng: e.target.value })}
            required
          />
          <button type="button" onClick={useCurrentLocation} className="location-btn">
            📍 Use My Location
          </button>
        </div>

        <h4>📦 Raw Materials</h4>
        {materials.map((mat, i) => (
          <div key={i} className="material-row">
            <input
              type="text"
              placeholder="Item Name"
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
            />
            <input
              type="number"
              placeholder="Discount (%)"
              value={mat.discount}
              onChange={(e) => handleMaterialChange(i, 'discount', e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => deleteMaterial(i)}
              className="delete-btn"
            >
              ❌
            </button>
          </div>
        ))}

        <button type="button" onClick={addMaterial} className="add-btn">+ Add Item</button>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Store Info'}
        </button>
      </form>
    </div>
  );
};

export default SellerDashboard;
