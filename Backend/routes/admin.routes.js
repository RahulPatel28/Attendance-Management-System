import express from 'express';
import { registerAdmin ,loginAdmin,logoutAdmin, registerEmployee, getEmployeeAttendance, getAllEmployees} from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router();

// Admin registration route
router.post('/register', registerAdmin);

router.post("/login", loginAdmin);

router.get("/logout", authMiddleware, logoutAdmin);

router.post('/register/employee', authMiddleware, registerEmployee);

router.get("/attendance/:empId", authMiddleware, getEmployeeAttendance);

router.get("/get-all-employees", authMiddleware, getAllEmployees);

export default router;
