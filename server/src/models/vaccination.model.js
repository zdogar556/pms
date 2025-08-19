import mongoose from "mongoose";

const VaccinationSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PoultryBatch",
      required: true,
    },
    vaccineName: { type: String, required: true },
    day: { type: Number, required: true }, // e.g., Day 7, 14, 21
    dateGiven: { type: Date, default: null }, // when actually given
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Vaccination", VaccinationSchema);
