import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  eggsSold: { type: Number, required: true },
  pricePerEgg: { type: Number, required: true },
  totalRevenue: { type: Number, required: true },
  totalExpense: { type: Number, required: true },
  totalSalaries: { type: Number, required: true },
  netProfit: { type: Number, required: true },
});

export default mongoose.model("Payroll", payrollSchema);
