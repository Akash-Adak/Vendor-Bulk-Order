import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // 👈 define role state
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Add to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: selectedRole,
        createdAt: new Date(),
      });

      console.log("User signed up and data stored!");
    } catch (err) {
      console.error("Signup failed:", err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold">Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
        required
      />

      {/* 👇 Add Role Selection */}
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="border p-2"
        required
      >
        <option value="">Select Role</option>
        <option value="vendor">Vendor</option>
        <option value="seller">Seller</option>
      </select>

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;
