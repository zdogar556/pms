// ⬇️ imports
import Attendance from "../models/attendance.model.js";
import Worker from "../models/worker.model.js";


// ✅ Create new attendance for a date + shift
export const createAttendance = async (req, res) => {
  try {
    const { date, shift, records } = req.body;

    if (!date || !shift || !Array.isArray(records)) {
      return res.status(400).json({ message: "Date, shift, and records are required" });
    }

    // Check if attendance for this date + shift already exists
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      date: { $gte: start, $lte: end },
      shift,
    });

    if (existing) {
      return res.status(400).json({ message: "Attendance already exists for this date and shift" });
    }

    // Create new attendance
    const attendance = new Attendance({
      date,
      shift,
      records, // [{ worker: workerId, status: "P" }]
    });

    await attendance.save();

    return res.status(201).json({
      message: "Attendance created successfully",
      attendance,
    });
  } catch (err) {
    console.error("Error creating attendance:", err.message);
    return res.status(500).json({ message: "Error creating attendance", error: err.message });
  }
};


// ✅ Get attendance by date + shift
export const getAttendanceByDateAndShift = async (req, res) => {
  try {
    const { date, shift } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      date: { $gte: start, $lte: end },
      shift,
    }).populate("records.worker").lean();

    if (!attendance) {
      return res.status(200).json([]);
    }

    const modifiedRecords = attendance.records.map((r) => ({
      ...r,
      attendanceId: attendance._id, // ✅ add parent id
    }));

    res.status(200).json(modifiedRecords);
  } catch (error) {
    console.error("Error fetching attendance:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Update one worker’s record status
export const updateAttendanceRecord = async (req, res) => {
  try {
    const { attendanceId, recordId } = req.params;
    const { status } = req.body;

    if (!["P", "A", "L"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const attendance = await Attendance.findById(attendanceId).populate("records.worker");
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });

    const record = attendance.records.id(recordId);
    if (!record) return res.status(404).json({ message: "Record not found" });

    record.status = status;
    await attendance.save();

    return res.status(200).json({
      message: "Attendance record updated",
      updatedRecord: record,
    });
  } catch (err) {
    console.error("Error updating record:", err.message);
    return res.status(500).json({ message: "Error updating record", error: err.message });
  }
};


// ✅ Delete one worker’s record
export const deleteAttendanceRecord = async (req, res) => {
  try {
    const { attendanceId, recordId } = req.params;

    const attendance = await Attendance.findById(attendanceId).populate("records.worker");
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });

    const record = attendance.records.id(recordId);
    if (!record) return res.status(404).json({ message: "Record not found" });

    record.deleteOne(); // ✅ better than .remove()
    await attendance.save();

    return res.status(200).json({
      message: "Attendance record deleted",
      deletedRecordId: recordId,
    });
  } catch (err) {
    console.error("Error deleting record:", err.message);
    return res.status(500).json({ message: "Error deleting record", error: err.message });
  }
};
// Get all attendance records
export const getAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate("records.worker", "name role shift"); // populate worker details
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendances", error });
  }
};
