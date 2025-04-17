import express from 'express';
import { changeEmployeePassword, loginEmployee, logoutEmployee, markAttendance  } from '../controllers/employee.controller.js';
import { verifyEmployee } from '../middlewares/employee.auth.js';
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() }); 

const router = express.Router();

// POST /api/employee/login
router.post('/login', loginEmployee);

router.get('/logout', logoutEmployee);

router.post('/change-password', verifyEmployee, changeEmployeePassword)

router.post("/mark/attendence", upload.single("photo"), markAttendance);

// backend routes
router.get("/test", (req, res) => {
    res.json({ message: "Axios working correctly! 🎉" });
  });
  

// Add more employee routes here later
export default router;
