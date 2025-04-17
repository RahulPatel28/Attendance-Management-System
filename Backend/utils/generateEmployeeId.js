import User from "../models/user.model.js";

const getDeptCode = (department) => {
  const map = {
    hr: "HR",
    development: "DEV",
    marketing: "MKT",
    sales: "SAL",
    finance: "FIN",
    design: "DSG",
  };

  return map[department.toLowerCase()] || "EMP";
};

const generateEmployeeId = async (department) => {
  const deptCode = getDeptCode(department);
  let unique = false;
  let empId = "";

  while (!unique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit
    empId = `${deptCode}${randomNum}`;

    const existing = await User.findOne({ empId });
    if (!existing) {
      unique = true;
    }
  }

  return empId;
};

export default generateEmployeeId;
