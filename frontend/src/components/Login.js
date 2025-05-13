import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setError('Invalid credentials');
        } else {
            setError('An error occurred. Please try again.');
    }
    console.error(error);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
