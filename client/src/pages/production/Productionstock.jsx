import React, { useEffect, useState } from "react";
import { useService } from "../../context";
import Loader from "../../components/Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProductionStock = () => {
  const { loading, productions, payrolls, getProductions, getPayrolls } =
    useService();
  const [availableGoodEggs, setAvailableGoodEggs] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getProductions();
    getPayrolls();
  }, []);

  useEffect(() => {
    if (!productions || !payrolls) return;

    // ✅ Group production by date (good eggs only)
    const productionByDate = productions.reduce((acc, p) => {
      const date = new Date(p.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (p.goodEggs || 0);
      return acc;
    }, {});

    // ✅ Group payroll (sold eggs) by date
    const payrollByDate = payrolls.reduce((acc, pr) => {
      const date = new Date(pr.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (pr.eggsSold || 0);
      return acc;
    }, {});

    // ✅ Calculate available good eggs
    const totalGood = productions.reduce(
      (sum, p) => sum + (p.goodEggs || 0),
      0
    );
    const totalSold = payrolls.reduce(
      (sum, pr) => sum + (pr.eggsSold || 0),
      0
    );
    setAvailableGoodEggs(totalGood - totalSold);

    // ✅ Merge all dates
    const allDates = [
      ...new Set([
        ...productions.map((p) => new Date(p.date).toLocaleDateString()),
        ...payrolls.map((pr) => new Date(pr.date).toLocaleDateString()),
      ]),
    ].sort((a, b) => new Date(a) - new Date(b));

    // ✅ Build running stock chart
    let runningStock = 0;
    const chart = allDates.map((date) => {
      const produced = productionByDate[date] || 0;
      const sold = payrollByDate[date] || 0;
      runningStock += produced;
      runningStock -= sold;
      return { date, stock: runningStock };
    });

    setChartData(chart);
  }, [productions, payrolls]);

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Egg Stock Overview
      </h2>

      {/* ✅ Available Eggs Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-5xl mx-auto w-full">
        <div className="p-4 rounded-lg shadow-md border-t-4 border-green-600 bg-white text-center sm:text-left">
          <h4 className="font-semibold text-gray-700">Available Eggs</h4>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {availableGoodEggs} Eggs
          </p>
        </div>
      </div>

      {/* ✅ Stock Trend Chart */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
        <h4 className="font-semibold text-gray-700 mb-4 text-center sm:text-left">
          Stock Trend Over Time
        </h4>
        <div className="w-full h-[250px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="stock"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductionStock;
