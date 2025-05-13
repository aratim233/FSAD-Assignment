import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Drives from './components/Drives';
import Report from './components/Report';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/students" element={isAuthenticated ? <Students /> : <Navigate to="/login" />} />
        <Route path="/drives" element={isAuthenticated ? <Drives /> : <Navigate to="/login" />} />
        <Route path="/report" element={isAuthenticated ? <Report /> : <Navigate to="/login" />} />
        {/* other protected routes */}
      </Routes>
    </Router>
  );
}

export default App;
