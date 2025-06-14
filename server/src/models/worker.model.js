import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  contact: { type: String, required: true },
  shift: { type: String, enum: ["Morning", "Evening", "Night"], required: true },
});

export default mongoose.model("Worker", workerSchema);
