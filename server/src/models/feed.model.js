import mongoose from "mongoose";

const feedSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  feedType: { type: String, required: true },
  quantity: { type: Number, required: true }, 
  cost: { type: Number, required: true },
  supplier: { type: String },
  notes: { type: String }
});

export default mongoose.model("Feed", feedSchema);
