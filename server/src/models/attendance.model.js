import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  shift: { type: String, enum: ["Morning", "Evening", "Night"], required: true },
  records: [
    {
      worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
      status: { type: String, enum: ["P", "A", "L"], required: true },
    }
  ]
});

export default mongoose.model("Attendance", attendanceSchema);
