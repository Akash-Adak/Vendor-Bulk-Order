import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import "../css/SellerStorePage.css";

const SellerStorePage = () => {
  const { userData } = useAuth();
  const [store, setStore] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ item: "", price: "", discount: "" });

  useEffect(() => {
    const fetchStore = async () => {
      const q = query(collection(db, "stores"), where("sellerId", "==", userData.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        setStore({ id: docSnap.id, ...docSnap.data() });
      });
    };
    if (userData?.uid) fetchStore();
  }, [userData]);

  const updateMaterial = async (index, field, value) => {
    const updatedMaterials = [...store.materials];
    updatedMaterials[index][field] = field === "item" ? value : Number(value);

    const ref = doc(db, "stores", store.id);
    await updateDoc(ref, { materials: updatedMaterials });
    setStore((prev) => ({ ...prev, materials: updatedMaterials }));
  };

  const addMaterial = async () => {
    const updatedMaterials = [...store.materials, {
      item: newMaterial.item,
      price: Number(newMaterial.price),
      discount: Number(newMaterial.discount)
    }];
    const ref = doc(db, "stores", store.id);
    await updateDoc(ref, { materials: updatedMaterials });
    setStore((prev) => ({ ...prev, materials: updatedMaterials }));
    setNewMaterial({ item: "", price: "", discount: "" });
  };

  if (!store) return <p>Loading store...</p>;

  return (
    <div className="seller-store">
      <h1>{store.name} – My Store</h1>
      <p><strong>Location:</strong> {store.location?.lat}, {store.location?.lng}</p>

      <h2>Listed Materials</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price (₹)</th>
            <th>Discount (%)</th>
          </tr>
        </thead>
        <tbody>
          {store.materials.map((mat, index) => (
            <tr key={index}>
              <td>
                <input
                  value={mat.item}
                  onChange={(e) => updateMaterial(index, "item", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mat.price}
                  onChange={(e) => updateMaterial(index, "price", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mat.discount}
                  onChange={(e) => updateMaterial(index, "discount", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add New Material</h3>
      <div className="add-material">
        <input
          type="text"
          placeholder="Item"
          value={newMaterial.item}
          onChange={(e) => setNewMaterial({ ...newMaterial, item: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newMaterial.price}
          onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Discount"
          value={newMaterial.discount}
          onChange={(e) => setNewMaterial({ ...newMaterial, discount: e.target.value })}
        />
        <button onClick={addMaterial}>Add Material</button>
      </div>
    </div>
  );
};

export default SellerStorePage;
