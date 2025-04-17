import React, { useEffect, useState } from "react";
import { FaUserPlus, FaCalendarCheck, FaHome, FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import Logout from "../components/Logout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);

  const admin = {
    name: "Pranay Rane",
    empId: "ADM123",
    email: "pranayrane029@gmail.com",
  };

  // 🧠 Fetch employees when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await Axios.get(SummaryApi.getAllEmployees.url);
        if (response?.data?.success) {
          setEmployees(response.data.employees);
        }
      } catch (error) {
        AxiosToastError(error);
      }
    };

    fetchEmployees();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 border-r border-gray-200">
        <h1 className="text-2xl font-bold text-blue-700 mb-10">Admin Panel</h1>
        <ul className="space-y-4">
          <li>
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/")}
            >
              <FaHome /> Home
            </button>
          </li>
          <li>
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/employee/register")}
            >
              <FaUserPlus /> Register Employee
            </button>
          </li>
          <li>
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              onClick={() => handleNavigation("/check/attendance")}
            >
              <FaCalendarCheck /> Check Attendance
            </button>
          </li>
          <li className="mt-[40vh]">
            <Logout />
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        {/* Admin Info */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-blue-800 mb-2">
            Welcome, {admin.name}!
          </h2>
          <p className="text-gray-600">
            Emp ID: {admin.empId} | Email: {admin.email}
          </p>
        </div>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.empId}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <FaRegUser size={50} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {emp.name}
                  </h3>
                  <p className="text-sm text-gray-500">ID: {emp.empId}</p>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                </div>
              </div>

              {/* Check Attendance Button */}
              <div className="mt-4 text-right">
                <button
                  onClick={() => navigate("/check/attendance")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Check Attendance
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* If no employees */}
        {employees.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No employees found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
