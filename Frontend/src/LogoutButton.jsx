import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const nav = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  return (
    <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-full w-full">
      Logout
    </button>
  );
};

export default LogoutButton;
