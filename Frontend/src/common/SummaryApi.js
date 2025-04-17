const SummaryApi = {
  adminRegister: {
    url: "/api/admin/register",
  },
  adminLogin : {
    url: "/api/admin/login",
  },
  registerEmployee : {
    url : "/api/admin/register/employee"
  },
  getAllEmployees : {
    url : "/api/admin/get-all-employees"
  },
  getAttendance: {
    url: "/api/admin/attendance", // you'll append /empId in component
  },
  markAttendance: {
    url: "/api/employee/mark/attendence", // ✅ Added this line
  },
  loginEmployee : {
    url : "/api/employee/login"
  },
  changePassword : {
    url : "/api/employee/change-password"
  }
};

export default SummaryApi;
