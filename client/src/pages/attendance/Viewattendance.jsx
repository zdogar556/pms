import React, { useState } from "react";
import { useService } from "../../context";
import Loader from "../../components/Loader";



const ViewAttendance = () => {
  const { getAttendanceByDateAndShift, loading } = useService();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("Morning");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleView = async () => {
    if (!selectedDate || !selectedShift) {
      alert("Please select both date and shift.");
      return;
    }

    setSubmitted(true);
    const data = await getAttendanceByDateAndShift(selectedDate, selectedShift);
    setAttendanceRecords(data || []);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">View Attendance</h2>

      <div className="flex items-center gap-4 mb-4">
        <label>
          Date:
          <input
            type="date"
            className="ml-2 border px-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
        <label>
          Shift:
          <select
            className="ml-2 border px-2 py-1"
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </label>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleView}
        >
          View Attendance
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : submitted ? (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Worker Name</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, index) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{record.worker?.name || "Unknown"}</td>
                    <td className="p-2 border">{record.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No attendance found for selected date and shift.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default ViewAttendance;
