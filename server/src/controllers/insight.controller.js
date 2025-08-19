import Worker from "../models/worker.model.js";
import EggProduction from "../models/production.model.js";
import PayrollModel from "../models/payroll.model.js";

export const getInsights = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const totalWorkers = await Worker.countDocuments();

    // ✅ Daily eggs production
    const eggsProduction = await EggProduction.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
        },
      },
      {
        $group: { _id: null, totalEggs: { $sum: "$totalEggs" } },
      },
    ]);
    const totalEggs = eggsProduction[0]?.totalEggs || 0;

    // ✅ Daily expenses (same as eggs logic)
    const payrollToday = await PayrollModel.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
        },
      },
      {
        $group: { _id: null, totalExpense: { $sum: "$totalExpense" } },
      },
    ]);
    const totalExpenses = payrollToday[0]?.totalExpense || 0;

    // Weekly eggs
    const weeklyEggProduction = await EggProduction.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lt: new Date(today.getTime() + 86400000) },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          totalEggs: { $sum: "$totalEggs" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedWeeklyData = weeklyEggProduction.map((item) => ({
      day: dayNames[item._id - 1],
      totalEggs: item.totalEggs,
    }));

    res.status(200).json({
      insights: {
        totalWorkers: totalWorkers || 0,
        totalEggs,
        totalExpenses,
        weeklyEggProduction: formattedWeeklyData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

