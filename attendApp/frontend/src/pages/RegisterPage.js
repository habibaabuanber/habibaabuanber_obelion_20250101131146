import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './RegisterPage.css';
import axios from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://attendapp-backend.cloud-stacks.com/api/register', {
        email,
        phoneNumber: phone,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) {
        setIsRegistered(true);
        alert('Registration successful');
      }
    } catch (error) {
      alert('Registration failed');
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
        },
      });
      if (response.status === 200) {
        alert('Login successful');
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const googleResponse = await axios.post('https://attendapp-backend.cloud-stacks.com/api/google-login', {
        token: response.credential,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (googleResponse.status === 200) {
        alert('Google login successful');
      }
    } catch (error) {
      alert('Google login failed');
    }
  };

  return (
    <div className="register-page">
      <h1>{isRegistered ? 'Login' : 'Register'}</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {isRegistered ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <button onClick={handleRegister}>Register</button>
      )}
      <GoogleLogin onSuccess={handleGoogleLoginSuccess} />
    </div>
  );
};

export default RegisterPage;