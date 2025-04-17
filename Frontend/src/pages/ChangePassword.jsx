import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios'; // Same Axios instance
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    empId: '',
    currentPassword: '',
    newPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { empId, currentPassword, newPassword } = formData;

    if (!empId || !currentPassword || !newPassword) {
      setError('Please fill all the required fields.');
      return;
    }

    try {
      const response = await Axios.post(SummaryApi.changePassword.url, formData); // 👈 adjust the route if different

      if (response.status === 200) {
        setError('');
        toast.success('Password changed successfully!');
        setTimeout(() => {
          navigate('/mark/attandence');
        }, 1000);
      }
    } catch (error) {
      setError('Password change failed. Please try again.');
      AxiosToastError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#155DFC] mb-6">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Employee ID</label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              placeholder="Enter your Employee ID"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155DFC]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155DFC]"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155DFC]"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-[#155DFC] text-white py-2 rounded-lg hover:bg-[#1b43db] transition duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
