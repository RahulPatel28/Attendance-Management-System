import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Previous page par le jaata hai
    navigate(-1);
    // alternatively: window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-all duration-200"
    >
      <BiArrowBack size={24} />
      <span>Go Back</span>
    </button>
  );
};

export default BackButton;
