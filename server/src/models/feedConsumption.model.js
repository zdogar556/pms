import mongoose from "mongoose";

const feedConsumptionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  feedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feed",
    required: true,
  },
  quantityUsed: {
    type: Number,
    required: true,
  },
  consumedBy: {
    type: String, // Or ObjectId referencing Worker if needed
    default: "Auto-logged",
  },
  notes: {
    type: String,
    default: "",
  },
});

export default mongoose.model("FeedConsumption", feedConsumptionSchema);
