import User from "../models/user.model.js";
import Attendance from "../models/attendence.model.js";
// import {uploadToCloudinary} from "../utils/uploadToCloudinary.js"; // Assuming this is your instance
import streamifier from "streamifier";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";



export const loginEmployee = async (req, res) => {
  try {
    const { empId, password } = req.body;

    // 🔎 Check if both fields are present
    if (!empId || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both empId and password" });
    }

    // 🔍 Find employee with that empId
    const employee = await User.findOne({ empId, role: "employee" });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { _id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 Optional: Set token in cookie
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 📤 Send response
    res.status(200).json({
      message: "Login successful",
      token,
      data: {
        name: employee.name,
        empId: employee.empId,
        email: employee.email,
        department: employee.department,
        role: employee.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const logoutEmployee = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};


export const changeEmployeePassword = async (req, res) => {
  try {
    const { empId, currentPassword, newPassword } = req.body;

    if (!empId || !currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide empId, current password, and new password.",
      });
    }

    // 🔍 Find the employee
    const employee = await User.findOne({ empId, role: "employee" });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // 🔐 Verify current password
    const isMatch = await bcrypt.compare(currentPassword, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // 🧂 Generate salt and hash new password
    const salt = await bcrypt.genSalt(10); // You can use 10, 12, or 15
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 💾 Save new password
    employee.password = hashedPassword;
    await employee.save();

    res.status(200).json({
      message: "Password changed successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while changing password.",
      error: error.message,
    });
  }
};


export const markAttendance = async (req, res) => {
  try {
    const { empId, name, location } = req.body;
    const file = req.file;

    if (!empId || !name || !location || !file) {
      return res.status(400).json({
        message: "Please provide all required fields (empId, name, location, and photo)",
      });
    }

    const userExists = await User.findOne({ empId, role: "employee" });
    if (!userExists) {
      return res.status(404).json({
        message: "Employee not found or not registered",
      });
    }

    // 📤 Upload buffer image to Cloudinary using upload_stream
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "GoBite" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload(file.buffer);

    const attendance = new Attendance({
      empId,
      name,
      location,
      photo: uploadResult.secure_url,
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while marking attendance",
      error: error.message,
    });
  }
};
