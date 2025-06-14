import mongoose from "mongoose";

const poultryRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PoultryBatch",
    required: true,
  },
  expiredCount: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
});

export default mongoose.model("poultryRecord", poultryRecordSchema);
