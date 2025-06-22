import mongoose from "mongoose";

const eggProductionSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalEggs: { type: Number, required: true },
  damagedEggs: { type: Number, default: 0 },
  goodEggs: { type: Number, default: 0 }, // New: auto-calculated field
});

export default mongoose.model("EggProduction", eggProductionSchema);
