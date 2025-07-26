import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../css/Login.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState(""); // New state for mobile number
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const userData = docSnap.data();
      toast.success("Login successful!");

      // ✅ Role-based redirect
      if (userData?.role === "vendor") {
        navigate("/");
      } else if (userData?.role === "seller") {
        navigate("/");
      } else {
        setError("Invalid role or user setup.");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        
        {/* New input field for Mobile Number */}
        <input
          type="tel"
          placeholder="Mobile Number (Optional)"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="login-input"
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;