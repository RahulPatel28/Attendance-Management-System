import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateEmployeeId from "../utils/generateEmployeeId.js";
import generatePassword from "../utils/generatePassword.js";
import sendEmail from "../utils/sendEmail.js";
import { employeeWelcomeTemplate } from "../utils/emailTemplates.js";
import Attendance from '../models/attendence.model.js'

export const registerAdmin = async (req, res) => {
  try {
    // Check if it's the first admin
    const existingAdmins = await User.find({ role: "admin" });

    if (existingAdmins.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const { empId, name, password, email } = req.body;

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const newAdmin = new User({
      empId,
      name,
      password: hashedPassword,
      email,
      role: "admin",
    });

    await newAdmin.save();

    // Generate JWT token
    const token = jwt.sign({ _id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send response
    res.status(201).json({
      message: "Admin registered successfully",
      data: {
        empId: newAdmin.empId,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      success : true
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering admin",
      error: error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { empId, password } = req.body;

    // Check if user exists with empId and is an admin
    const admin = await User.findOne({ empId, role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare the entered password with hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set token in cookie (optional, can be used with frontend)
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    

    res.status(200).json({
      message: "Admin logged in successfully",
      token,
      user: {
        empId: admin.empId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      success : true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in admin", error: error.message });
  }
};

export const logoutAdmin = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true, // set to true in production
      sameSite: "None", // adjust based on deployment
    });

    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging out",
      error: error.message,
      success: false,
    });
  }
};


export const registerEmployee = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({
        message: "Please provide name, email and department",
      });
    }

    // Generate ID and password
    const empId = await generateEmployeeId(department);
    const plainPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const newEmployee = new User({
      empId,
      name,
      email,
      department,
      password: hashedPassword,
      role: "employee",
    });

    await newEmployee.save();

    // ✉️ Send Email
    const emailHTML = employeeWelcomeTemplate(name, empId, plainPassword);
    await sendEmail(email, "Welcome to the Company! Your Login Credentials", emailHTML);

    res.status(201).json({
      message: "Employee registered successfully",
      credentials: {
        empId,
        password: plainPassword,
      },
      success : true
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while registering employee",
      error: error.message,
    });
  }
};


// GET /api/admin/attendance/:empId
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { empId } = req.params;

    if (!empId) {
      return res.status(400).json({
        message: "Employee ID is required",
      });
    }

    const userExists = await User.findOne({ empId, role: "employee" });
    if (!userExists) {
      return res.status(404).json({
        message: "Employee not found or not registered",
      });
    }

    const attendanceRecords = await Attendance.find({ empId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Attendance fetched successfully",
      count: attendanceRecords.length,
      records: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching attendance",
      error: error.message,
    });
  }
};


export const getAllEmployees = async (req, res) => {
  try {
    // req.userId comes from authMiddleware
    const employees = await User.find({
      role: "employee",
    }).select("-password"); // Don't return password

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};