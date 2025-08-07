// src/pages/SignUp.jsx
import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

import toast from "react-hot-toast";
import "../css/SignUp.css"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();

  if (!selectedRole) {
    setError("Please select a role.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);
    toast.success("Verification email sent. Please check your inbox.");

    // Save user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: selectedRole,
      createdAt: new Date(),
      emailVerified: false, // track manually if you want
    });

    console.log("✅ User signed up and stored in Firestore.");
    navigate("/login");
  } catch (err) {
    console.error("❌ Signup failed:", err.message);
    setError(err.message);
  }
};


  const handleGoogleSignup = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Optional: Check if user already exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
      console.log(userSnap);
    if (!userSnap.exists()) {
      // Assign default role: "vendor" (or allow role selection later)
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        role: "vendor", // or you can ask them later
        createdAt: new Date(),
      });
    }
      
    toast.success("Signed in with Google!");
        navigate("/");

  } catch (error) {
    console.error("Google Sign-In Error:", error);
    toast.error("Google Sign-In failed");
  }
};


  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2 className="signup-title">Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
          required
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="signup-select"
          required
        >
          <option value="">Select Role</option>
          <option value="vendor">Vendor</option>
          <option value="seller">Seller</option>
        </select>

        {error && <p className="signup-error">{error}</p>}
        
        <button type="submit" className="signup-button">
          Sign Up
        </button>

      <button type="button" className="google-signup-button" onClick={handleGoogleSignup}>
  <img
    src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0"
    alt="Google logo"
    className="google-logo"
  />
  Sign Up with Google
</button>


      </form>
    </div>
  );
};

export default SignUp;