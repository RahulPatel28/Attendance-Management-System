import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Token ko remove karo localStorage se
    localStorage.removeItem('token');

    // Redirect to home page
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center ">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
