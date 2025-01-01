import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/register', {
        email,
        phoneNumber,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const googleToken = response.tokenId; // Assuming tokenId is the Google token
      const result = await axios.post('https://attendapp-backend.cloud-stacks.com/api/google-login', {
        token: googleToken,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email or Phone Number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={handleGoogleLoginError}
      />
    </div>
  );
};

export default Register;