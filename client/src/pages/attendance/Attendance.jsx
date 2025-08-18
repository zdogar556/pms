import React, { useEffect, useState } from "react";
import { useService } from "../../context";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const {
    getWorkers,
    workers,
    createAttendance,
    getAttendanceByDateAndShift,
    loading,
  } = useService();

  const [selectedShift, setSelectedShift] = useState("Morning");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getWorkers();
  }, []);

  const handleChange = (workerId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [workerId]: status,
    }));
  };

  const handleSubmit = async () => {
  if (validationErrors.date) {
    alert("Please fix validation errors before submitting.");
    return;
  }

  if (!selectedDate || !selectedShift) {
    alert("Please select date and shift");
    return;
  }

  // 1️⃣ Check if attendance already exists
  const existing = await getAttendanceByDateAndShift(
    selectedDate,
    selectedShift
  );

  if (existing && existing.records && existing.records.length > 0) {
    alert(
      `Attendance for ${selectedShift} on ${selectedDate} already exists!`
    );
    return;
  }

  // 2️⃣ Build records array (not per worker object)
  const records = filteredWorkers.map((worker) => ({
    worker: worker._id,
    status: attendanceData[worker._id] || "A", // default Absent
  }));

  // 3️⃣ Correct payload for backend
  const payload = {
    date: selectedDate,
    shift: selectedShift,
    records,
  };

  try {
    await createAttendance(payload); // ✅ send once
    setAttendanceData({});
    alert("Attendance saved successfully!");
  } catch (err) {
    console.error("Error saving attendance:", err);
    alert("Failed to save attendance");
  }
};


  const handleDateChange = (value) => {
    setSelectedDate(value);

    const errors = { ...validationErrors };
    const selected = new Date(value);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected > today) {
      errors.date = "Future date is not allowed.";
    } else {
      delete errors.date;
    }

    setValidationErrors(errors);
  };

  const filteredWorkers = workers.filter(
    (worker) => worker.shift === selectedShift
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Attendance</h2>

      {/* Controls */}
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <div className="flex flex-col">
          <label>
            Date:
            <input
              type="date"
              className="ml-2 border px-2 py-1"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </label>
          {validationErrors.date && (
            <span className="text-red-500 text-sm mt-1">
              {validationErrors.date}
            </span>
          )}
        </div>

        <label className="flex items-center">
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={handleSubmit}
        >
          Submit Attendance
        </button>

        {/* ✅ Navigate to ViewAttendance Page */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/pms/worker/attendance/viewattendance")}
        >
          View Attendance
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border text-center">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker, index) => {
                const currentStatus = attendanceData[worker._id] || "A";

                return (
                  <tr key={worker._id} className="hover:bg-gray-50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">{worker.name}</td>
                    <td className="p-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className={`px-3 py-1 rounded ${
                            currentStatus === "P"
                              ? "bg-green-600 text-white"
                              : "bg-green-100 text-green-800"
                          }`}
                          onClick={() => handleChange(worker._id, "P")}
                        >
                          P
                        </button>
                        <button
                          className={`px-3 py-1 rounded ${
                            currentStatus === "A"
                              ? "bg-red-600 text-white"
                              : "bg-red-100 text-red-800"
                          }`}
                          onClick={() => handleChange(worker._id, "A")}
                        >
                          A
                        </button>
                        <button
                          className={`px-3 py-1 rounded ${
                            currentStatus === "L"
                              ? "bg-gray-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                          onClick={() => handleChange(worker._id, "L")}
                        >
                          L
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredWorkers.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No workers found for this shift.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
