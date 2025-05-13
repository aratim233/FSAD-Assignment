import React from 'react';

export default function Dashboard({ setToken }) {
  const handleLogout = () => {
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <h1>Welcome, School Coordinator!</h1>
      <p>This is your personalized dashboard with actionable data.</p>
      {/* Add your dashboard widgets here */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}
