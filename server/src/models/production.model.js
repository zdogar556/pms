import mongoose from "mongoose";

const eggProductionSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  totalEggs: { type: Number, required: true },
  damagedEggs: { type: Number, default: 0 },
});

export default mongoose.model("EggProduction", eggProductionSchema);
