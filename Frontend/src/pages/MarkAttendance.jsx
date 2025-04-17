import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Axios from "../utils/Axios";
import { useNavigate } from "react-router-dom";

import SummaryApi from "../common/SummaryApi";
import BackButton from "../components/BackButton";

const MarkAttendance = () => {
  const [empId, setEmpId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation(data.display_name || `${latitude}, ${longitude}`);
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation(`${latitude}, ${longitude}`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location not available");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  // Capture image from webcam
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

  // Submit attendance data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!empId || !name || !location || !imageSrc) {
      alert("Please fill all fields and capture a photo.");
      return;
    }

    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const file = new File([blob], "attendance.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("empId", empId);
      formData.append("name", name);
      formData.append("location", location);
      formData.append("photo", file); // ✅ Changed from 'file' to 'photo'

      const response = await Axios.post(
        SummaryApi.markAttendance.url, // ✅ Using from SummaryApi
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Response:", response);
      alert(response.data.message);

      // Reset form
      setEmpId("");
      setName("");
      setImageSrc(null);
    } catch (error) {
      console.error("❌ Error submitting attendance:", error);
      alert("Failed to mark attendance.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="absolute top-28 left-5">
        <BackButton />
      </div>
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Mark Attendance
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Employee ID
            </label>
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Capture Photo
            </label>
            {imageSrc ? (
              <div className="space-y-2">
                <img
                  src={imageSrc}
                  alt="Captured"
                  className="w-full rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setImageSrc(null)}
                  className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Retake Photo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg border"
                />
                <button
                  type="button"
                  onClick={capture}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Capture Photo
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit Attendance
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/change-password")}
          className="w-full bg-indigo-600 text-white mt-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
