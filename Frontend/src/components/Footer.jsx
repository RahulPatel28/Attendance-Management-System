// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 px-4 shadow-inner">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        
        {/* Project Description */}
        <div className="max-w-md">
          <h2 className="text-lg font-semibold mb-1 text-white">Attendance Management System</h2>
          <p className="text-sm leading-snug text-gray-300">
            A simple yet powerful solution for managing employee attendance. Employees can mark their presence with location, time, and photo – and admins can track it all with ease.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-3">
          <a
            href="/"
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-200 text-sm font-medium"
          >
            Home
          </a>
          <a
            href="/register"
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-200 text-sm font-medium"
          >
            Register
          </a>
          <a
            href="/admin/dashboard"
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all duration-200 text-sm font-medium"
          >
            Admin Dashboard
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-xs text-gray-400 mt-4">
        &copy; {new Date().getFullYear()} Attendance Management System. Built with 💙 using the MERN stack.
      </div>
    </footer>
  );
};

export default Footer;
