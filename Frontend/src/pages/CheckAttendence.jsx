import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios'; // Your axios instance
import SummaryApi from '../common/SummaryApi'; // API endpoints config
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';

const CheckAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [filter, setFilter] = useState('all');
  const [loadingEmpId, setLoadingEmpId] = useState(null);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await Axios.get(SummaryApi.getAllEmployees.url);
        if (response?.data?.success) {
          setEmployees(response.data.employees);
        }
      } catch (error) {
        AxiosToastError(error);
      }
    };

    fetchEmployees();
  }, []);

  const handleCheckAttendance = async (empId) => {
    // Toggle display
    if (attendanceData[empId]) {
      setAttendanceData((prev) => {
        const updated = { ...prev };
        delete updated[empId];
        return updated;
      });
      return;
    }

    try {
      setLoadingEmpId(empId);
      const response = await Axios.get(`${SummaryApi.getAttendance.url}/${empId}`);

      if (response?.data?.records) {
        const filteredRecords = filterAttendance(response.data.records);
        setAttendanceData((prev) => ({
          ...prev,
          [empId]: {
            count: response.data.count,
            records: filteredRecords,
          },
        }));
      } else {
        toast.error("No attendance data found.");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingEmpId(null);
    }
  };

  const filterAttendance = (records) => {
    const now = new Date();
    return records.filter((record) => {
      const date = new Date(record.date);
      if (filter === 'day') {
        return date.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return date >= startOfWeek && date <= endOfWeek;
      } else if (filter === 'month') {
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      } else if (filter === 'year') {
        return date.getFullYear() === now.getFullYear();
      } else {
        return true;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-8">
      <BackButton />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">
            Check Employee Attendance
          </h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-gray-700 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {employees.map((employee) => (
          <div
            key={employee.empId}
            className="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{employee.name}</p>
                <p className="text-sm text-gray-600">ID: {employee.empId}</p>
                <p className="text-sm text-gray-600">Dept: {employee.department}</p>
              </div>
              <button
                onClick={() => handleCheckAttendance(employee.empId)}
                disabled={loadingEmpId === employee.empId}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {loadingEmpId === employee.empId ? "Loading..." : "Check"}
              </button>
            </div>

            {attendanceData[employee.empId] && (
              <div className="mt-4">
                {attendanceData[employee.empId].records.length > 0 ? (
                  <div className="space-y-3">
                    <p className="font-medium text-gray-700">
                      Total Attendance Count - {attendanceData[employee.empId].count}
                    </p>
                    {attendanceData[employee.empId].records.map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-white border rounded-md shadow-sm"
                      >
                        <img
                          src={record.photo}
                          alt="Employee"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {new Date(record.date).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {record.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500 mt-2">No attendance found for selected filter.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckAttendance;
