import mongoose from "mongoose";

const poultryBatchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  type: { type: String, enum: ["Broiler", "Layer"], required: true },
  quantity: { type: Number, required: true },
  startDate: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model("PoultryBatch", poultryBatchSchema);
