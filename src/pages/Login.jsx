// src/pages/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data()?.role;

      if (role === "vendor") navigate("/vendor");
      else if (role === "seller") navigate("/seller");
      else navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
