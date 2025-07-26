import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function BulkOrderForm() {
  const [vendorId, setVendorId] = useState("");
  const [orders, setOrders] = useState([{ itemName: "", quantity: "", unit: "kg" }]);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [date, setDate] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...orders];
    updated[index][field] = value;
    setOrders(updated);
  };

  const addOrderItem = () => {
    setOrders([...orders, { itemName: "", quantity: "", unit: "kg" }]);
  };

  const submitOrder = async () => {
    try {
      await addDoc(collection(db, "bulkOrders"), {
        vendorId,
        orders,
        deliveryLocation: { address, pincode },
        expectedDeliveryDate: date,
        createdAt: new Date()
      });
      alert("Bulk order placed!");
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bulk Order Form</h1>

      <input type="text" value={vendorId} onChange={(e) => setVendorId(e.target.value)} placeholder="Vendor ID" className="border p-2 w-full mb-2" />

      {orders.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input type="text" value={item.itemName} onChange={(e) => handleChange(index, "itemName", e.target.value)} placeholder="Item Name" className="border p-2 w-1/2" />
          <input type="number" value={item.quantity} onChange={(e) => handleChange(index, "quantity", e.target.value)} placeholder="Qty" className="border p-2 w-1/4" />
          <select value={item.unit} onChange={(e) => handleChange(index, "unit", e.target.value)} className="border p-2 w-1/4">
            <option value="kg">kg</option>
            <option value="litre">litre</option>
            <option value="pcs">pcs</option>
          </select>
        </div>
      ))}

      <button onClick={addOrderItem} className="bg-blue-500 text-white px-4 py-1 mb-4 rounded">+ Add Item</button>

      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery Address" className="border p-2 w-full mb-2" />
      <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" className="border p-2 w-full mb-2" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 w-full mb-4" />

      <button onClick={submitOrder} className="bg-green-600 text-white px-4 py-2 rounded">Submit Order</button>
    </div>
  );
}
