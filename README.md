
# 🛒 BulkBuddy – Bulk Order Web App for Street Vendors

BulkBuddy is a full-stack web application that connects street food vendors with local sellers to purchase raw materials like vegetables, oil, and grains in bulk at competitive prices.

---

## 🚀 Features

### ✅ For Vendors
- 🔐 Login/Register via Email or Phone OTP (Firebase Auth)
- 📦 Place bulk orders from nearby stores
- 📍 Smart price comparison based on location and rates
- 📋 View and manage **My Orders**
- 📊 Vendor Dashboard: see total orders, pending orders & revenue

### 🛍️ For Sellers
- 🔐 Secure login with role = seller
- 📦 Manage store inventory (raw materials, prices, discounts)
- ✏️ Edit material prices and availability
- 🧾 View orders placed by vendors
- 📍 Auto-location based store visibility

### 🧠 Smart Features
- 📸 AI-generated product images (based on raw material name)
- 📍 Geo-location based store sorting
- 🔔 Toast notifications
- 📊 Role-based dashboard redirects

---

## 🧰 Tech Stack

| Layer        | Tech                      |
|--------------|---------------------------|
| Frontend     | React.js, React Router    |
| Styling      | Vanilla CSS or TailwindCSS|
| Backend      | Firebase (No server needed)|
| Database     | Firebase Firestore        |
| Auth         | Firebase Authentication   |
| Image Gen    | Pexels API / AI image gen |
| Hosting      | Firebase Hosting (optional)|

---

## 🔧 Project Structure

```

src/
├── components/        # Reusable components (Navbar, Toast, etc)
├── pages/             # Main views (HomePage, Login, Signup, Dashboard)
├── firebase.js        # Firebase initialization
├── App.js             # Routes + App layout
├── hooks/             # Custom auth hook
├── css/               # Plain CSS files
└── index.js

````

---

## 🧪 Firebase Setup

1. Create a Firebase Project: https://console.firebase.google.com
2. Enable:
   - Firestore Database
   - Authentication (Email/Password + Phone)
3. In `src/firebase.js`:
   
   ```js
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```




## 🧪 Firestore Collections (Structure)

### 🛍️ stores

```json
{
  "sellerId": "UID_of_seller",
  "name": "Store Name",
  "location": { "lat": 26.7, "lng": 88.4 },
  "materials": [
    {
      "item": "Flour",
      "price": 25,
      "discount": 2
    },
    ...
  ]
}
```

### 📦 bulkOrders

```json
{
  "vendorId": "UID_of_vendor",
  "vendorEmail": "example@gmail.com",
  "createdAt": Timestamp,
  "orders": [
    {
      "item": "Potato",
      "quantity": 5,
      "price": 30,
      "status": "Pending",
      "storeName": "LocalMart"
    },
    ...
  ]
}
```

---

## 🔐 Role-Based Access

| Role   | Access to                           |
| ------ | ----------------------------------- |
| Vendor | Order materials, View Orders        |
| Seller | Add/Edit Materials, View Store Data |

Firestore rules example (simplified):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /stores/{storeId} {
      allow read, write: if request.auth.uid == resource.data.sellerId;
    }
    match /bulkOrders/{orderId} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.vendorId;
    }
  }
}
```

---

## 🛠️ How to Run Locally

```bash
git clone https://github.com/yourusername/BulkBuddy.git
cd BulkBuddy
npm install
npm start
```

---

## 🌐 Deployment (Firebase Hosting)

```bash
npm run build
firebase login
firebase init hosting
firebase deploy
```


## 📄 License

This project is open-source and free to use under the MIT License.

```
