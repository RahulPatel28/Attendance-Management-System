import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="max-h-[75vh] flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 h-64 md:h-auto">
        <img
          src="https://media.istockphoto.com/id/638204032/photo/woman-scaning-finger-print-for-enter-security-system.webp?a=1&b=1&s=612x612&w=0&k=20&c=7fJg-SK9GG1Wi2AomPgomHDdHyDlC1IvFFYH6Kw6OZo="
          alt="Attendance"
          className=" object-cover w-full h-full"
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 to-purple-200 relative flex flex-col justify-center px-8 py-6">
        {/* Top-right buttons */}
        {/* <div className="absolute top-4 right-4 space-x-4">
          <Link
            to="/employee/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/employee/register"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Register
          </Link>
        </div> */}

        {/* Center content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            Smart Employee Attendance System
          </h1>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Say goodbye to manual tracking! Our system helps you manage attendance using real-time location, camera snapshots, and secured login — built for modern teams.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;