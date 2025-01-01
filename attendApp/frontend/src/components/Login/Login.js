import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/register', {
        email,
        phoneNumber,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response?.data?.error || 'Registration error');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response?.data?.error || 'Login error');
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const googleToken = response.credential;
      const res = await axios.post('https://attendapp-backend.cloud-stacks.com/api/google-login', {
        token: googleToken,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(res.data.message);
    } catch (error) {
      console.error(error.response?.data?.error || 'Google login error');
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login failed', error);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />
      </div>
    </div>
  );
};

export default Login;