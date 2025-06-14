import Payroll from "../models/payroll.model.js";
import Worker from "../models/worker.model.js";

// Create Payroll Record
export const createPayroll = async (req, res) => {
  try {
    const { date, eggsSold, pricePerEgg, totalExpense } = req.body;

    const totalRevenue = eggsSold * pricePerEgg;

    const workers = await Worker.find();
    const totalSalaries = workers.reduce(
      (acc, worker) => acc + worker.salary,
      0
    );

    const netProfit = Math.abs(Number(totalRevenue) - (Number(totalExpense) + Number(totalSalaries)));

    const payroll = new Payroll({
      date,
      eggsSold,
      pricePerEgg,
      totalRevenue,
      totalExpense,
      totalSalaries,
      netProfit,
    });
    await payroll.save();

    res.status(201).json({ payroll, message: "Payroll created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Payroll Records
export const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find();
    res.status(200).json({ payrolls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Payroll Record
export const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    res.status(200).json({ payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Payroll Record
export const deletePayroll = async (req, res) => {
  try {
    const deletedPayroll = await Payroll.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Payroll record deleted", deletedPayroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Payroll Record
export const updatePayroll = async (req, res) => {
  try {
    const { date, eggsSold, pricePerEgg, totalExpense } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    const totalRevenue = eggsSold * pricePerEgg;

    const workers = await Worker.find();
    const totalSalaries = workers.reduce(
      (acc, worker) => acc + worker.salary,
      0
    );

    const netProfit = totalRevenue - (totalExpense + totalSalaries);

    payroll.date = date || payroll.date;
    payroll.eggsSold = eggsSold || payroll.eggsSold;
    payroll.pricePerEgg = pricePerEgg || payroll.pricePerEgg;
    payroll.totalExpense = totalExpense || payroll.totalExpense;
    payroll.totalRevenue = totalRevenue;
    payroll.totalSalaries = totalSalaries;
    payroll.netProfit = netProfit;

    await payroll.save();

    res
      .status(200)
      .json({ message: "Payroll record updated", updatedPayroll: payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
