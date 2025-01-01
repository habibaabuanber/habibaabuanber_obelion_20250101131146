import React, { createContext, useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register/Register.js';
import Login from './components/Login/Login.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import AddOrganizer from './components/AddOrganizer/AddOrganizer.js';
import ManagePermissions from './components/ManagePermissions/ManagePermissions.js';
import AttendeeManagement from './components/AttendeeManagement/AttendeeManagement.js';
import Invitation from './components/Invitation/Invitation.js';

export const AuthContext = createContext();

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = useCallback((token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token with backend
      fetch('/verify-token', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => response.json())
        .then(data => {
          if (data.valid) {
            setIsAuthenticated(true);
          } else {
            logout();
          }
        })
        .catch(() => logout());
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav role="navigation" style={{ padding: '1rem', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
          <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          {isAuthenticated ? (
            <>
              <Link to="/add-organizer" style={{ marginRight: '1rem' }}>Add Organizer</Link>
              <Link to="/manage-permissions" style={{ marginRight: '1rem' }}>Manage Permissions</Link>
              <Link to="/attendee-management" style={{ marginRight: '1rem' }}>Attendee Management</Link>
              <Link to="/invitation" style={{ marginRight: '1rem' }}>Invitation</Link>
              <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
        
        <main style={{ flex: '1', padding: '1rem' }}>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login onLoginSuccess={login} /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-organizer" element={<ProtectedRoute><AddOrganizer /></ProtectedRoute>} />
            <Route path="/manage-permissions" element={<ProtectedRoute><ManagePermissions /></ProtectedRoute>} />
            <Route path="/attendee-management" element={<ProtectedRoute><AttendeeManagement /></ProtectedRoute>} />
            <Route path="/invitation" element={<ProtectedRoute><Invitation /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>

        <footer style={{ background: '#f0f0f0', padding: '1rem', textAlign: 'center', borderTop: '1px solid #ccc' }}>
          &copy; 2024 Attend App. All rights reserved.
        </footer>
      </div>
    </AuthContext.Provider>
  );
};

export default App;