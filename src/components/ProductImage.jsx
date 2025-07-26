import React, { useState } from 'react';
import axios from 'axios';

const PEXELS_API_KEY = '4zku6FCJ44pQzFwLc5oJ3xrsyGnGUISuesAyM99dhYfTXQigACES1NSF'; // 🔁 Replace this with your key

const ProductImageSearch = ({ onImageSelect }) => {
  const [productName, setProductName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const searchImage = async () => {
    if (!productName) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://api.pexels.com/v1/search`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        params: {
          query: productName,
          per_page: 1,
        },
      });

      const photo = res.data.photos[0];
      if (photo && photo.src.medium) {
        setImageUrl(photo.src.medium);
        onImageSelect(photo.src.medium); // 👈 callback to parent to store URL
      } else {
        setImageUrl('');
      }
    } catch (err) {
      console.error('Error fetching image:', err);
      setImageUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">Auto Fetch Product Image</h2>
      <input
        type="text"
        placeholder="Enter product name (e.g., Tomato)"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-2"
      />
      <button
        onClick={searchImage}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Loading...' : 'Fetch Image'}
      </button>

      {imageUrl && (
        <div className="mt-4">
          <p className="mb-2 font-semibold">Preview:</p>
          <img src={imageUrl} alt="Product" className="rounded w-full" />
        </div>
      )}
    </div>
  );
};

export default ProductImageSearch;
