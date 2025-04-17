import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AdminRegister from "../pages/AdminRegister";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLogin from "../pages/AdminLogin";
import EmployeeRegister from "../pages/EmployeeRegister";
import CheckAttendance from "../pages/CheckAttendence";
import MarkAttendance from "../pages/MarkAttendance";
import EmployeeLogin from "../pages/EmployeeLogin";
import ChangePassword from "../pages/ChangePassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "",
            element: <Home />
        },
        {
            path : "register",
            element : <AdminRegister />
        },
        {
            path : 'login',
            element : <AdminLogin />
        },
        {
            path : "admin/dashboard",
            element : <AdminDashboard />
        },
        {
            path : "employee/register",
            element : <EmployeeRegister />
        },
        {
            path : "check/attendance",
            element : <CheckAttendance />
        },
        {
            path : "mark/attandence",
            element : <MarkAttendance />
        },
        {
            path : "employee/login",
            element : <EmployeeLogin />
        },
        {
            path : "change-password",
            element : <ChangePassword />
        }
    ],
  },
]);


export default router;