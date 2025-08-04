import Attendance from "../models/attendance.model.js";
import Worker from "../models/worker.model.js";

// Create attendance record
export const createAttendance = async (req, res) => {
  try {
    const { date, shift, workerId, status } = req.body;

    const parsedDate = new Date(date);
    parsedDate.setHours(0, 0, 0, 0);

    // Check if an attendance record exists for the date and shift
    let attendance = await Attendance.findOne({
      date: { $gte: parsedDate, $lt: new Date(parsedDate.getTime() + 86400000) },
      shift,
    });

    if (!attendance) {
      attendance = new Attendance({
        date: parsedDate,
        shift,
        records: [],
      });
    }

    // Check if worker already has an entry
    const existingIndex = attendance.records.findIndex(
      (r) => r.worker.toString() === workerId
    );

    if (existingIndex !== -1) {
      // Update existing
      attendance.records[existingIndex].status = status;
    } else {
      // Add new
      attendance.records.push({ worker: workerId, status });
    }

    await attendance.save();
    res.status(200).json({ message: "Attendance saved", attendance });
  } catch (err) {
    res.status(500).json({ message: "Error saving attendance", error: err.message });
  }
};

// Get all attendance records
export const getAttendances = async (req, res) => {
  try {
    const records = await Attendance.find().populate("records.worker");
    res.status(200).json({ attendance: records });
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance", error: err.message });
  }
};

// Get attendance by date and shift
export const getAttendanceByDateAndShift = async (req, res) => {
  try {
    const { date, shift } = req.query;
    console.log("Received date:", date, "Shift:", shift);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    console.log("Searching between:", start, "and", end);

    const attendance = await Attendance.findOne({
      date: { $gte: start, $lte: end },
      shift,
    }).populate("records.worker");

    if (!attendance) {
      console.log("No attendance found.");
      return res.status(200).json([]); // Return empty
    }

    console.log("Attendance found:", attendance.records.length);
    res.status(200).json(attendance.records); // Return the array
  } catch (error) {
    console.error("Error fetching attendance:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

