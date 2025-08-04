import React, { useEffect, useState } from "react";
import { useService } from "../../context";
import Loader from "../../components/Loader";

const Attendance = () => {
  const {
    getWorkers,
    workers,
    createAttendance,
    getAttendanceByDateAndShift,
    loading,
  } = useService();

  const [selectedShift, setSelectedShift] = useState("Morning");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substr(0, 10));
  const [attendanceData, setAttendanceData] = useState({});

  const [viewMode, setViewMode] = useState(false);
  const [viewResults, setViewResults] = useState([]);

  

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
    const attendanceArray = Object.entries(attendanceData).map(([workerId, status]) => ({
      date: selectedDate,
      shift: selectedShift,
      workerId,
      status,
    }));

    for (let record of attendanceArray) {
      await createAttendance(record);
    }

    setAttendanceData({});
    alert("Attendance submitted successfully!");
  };

 const handleViewAttendance = async () => {
  const data = await getAttendanceByDateAndShift(selectedDate, selectedShift);
  console.log("Attendance fetched:", data); // <-- Add this
  setViewResults(Array.isArray(data) ? data : []);
  setViewMode(true);
};

  const filteredWorkers = workers.filter((worker) => worker.shift === selectedShift);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Attendance</h2>

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
        {!viewMode ? (
          <>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={handleSubmit}
            >
              Submit Attendance
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={handleViewAttendance}
            >
              View Attendance
            </button>
          </>
        ) : (
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={() => setViewMode(false)}
          >
            Back to Marking
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : viewMode ? (
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
              {viewResults.length > 0 ? (
                viewResults.map((record, index) => (
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
                const currentStatus = attendanceData[worker._id] || "A"; // Default to A

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
