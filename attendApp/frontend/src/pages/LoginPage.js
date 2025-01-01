import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = isRegistering
      ? 'https://attendapp-backend.cloud-stacks.com/api/register'
      : 'https://attendapp-backend.cloud-stacks.com/api/login';
    
    const body = {
      email,
      phoneNumber: isRegistering ? phoneNumber : undefined,
      password,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle successful login or registration
        console.log(data.message);
      } else {
        // Handle errors
        console.error(data.error);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const googleResponse = await fetch('https://attendapp-backend.cloud-stacks.com/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await googleResponse.json();
      if (googleResponse.ok) {
        // Handle successful Google login
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
  };

  return (
    <div className="login-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange(setEmail)}
          required
        />
        {isRegistering && (
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handleInputChange(setPhoneNumber)}
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange(setPassword)}
          required
        />
        <button type="submit">
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </button>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
        />
      </form>
    </div>
  );
}

export default LoginPage;