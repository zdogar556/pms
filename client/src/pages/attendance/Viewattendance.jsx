import React, { useState } from "react";
import { useService } from "../../context";
import Loader from "../../components/Loader";

const ViewAttendance = () => {
  const {
    getAttendanceByDateAndShift,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    loading,
  } = useService();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("Morning");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Track which record is being edited
  const [editingRecordId, setEditingRecordId] = useState(null);

  const handleView = async () => {
    if (!selectedDate || !selectedShift) {
      alert("Please select both date and shift.");
      return;
    }
    setSubmitted(true);
    const data = await getAttendanceByDateAndShift(selectedDate, selectedShift);
    setAttendanceRecords(Array.isArray(data) ? data : []);
    setEditingRecordId(null); // reset edit mode
  };

  const handleUpdate = async (attendanceId, recordId, status) => {
    try {
      await updateAttendanceRecord(attendanceId, recordId, { status });
      await handleView(); // refresh
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (attendanceId, recordId) => {
    if (!window.confirm("Delete this worker's record from this shift?")) return;
    try {
      await deleteAttendanceRecord(attendanceId, recordId);
      await handleView(); // refresh
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">View Attendance</h2>

      {/* Filters */}
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

      {/* Records Table */}
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
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((record, index) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">
                      {record?.worker?.name || "Unknown"}
                    </td>
                    <td className="p-2 border text-center">
                      {editingRecordId === record._id ? (
                        <div className="flex justify-center gap-2">
                          {["P", "A", "L"].map((s) => (
                            <button
                              key={s}
                              className={`px-3 py-1 rounded ${
                                record.status === s
                                  ? s === "P"
                                    ? "bg-green-600 text-white"
                                    : s === "A"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-600 text-white"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                              onClick={() =>
                                handleUpdate(record.attendanceId, record._id, s)
                              }
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded ${
                            record.status === "P"
                              ? "bg-green-600 text-white"
                              : record.status === "A"
                              ? "bg-red-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td className="p-2 border text-center flex justify-center gap-2">
                      {editingRecordId === record._id ? (
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600"
                          onClick={() => setEditingRecordId(null)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                          onClick={() => setEditingRecordId(record._id)}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() =>
                          handleDelete(record.attendanceId, record._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
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
