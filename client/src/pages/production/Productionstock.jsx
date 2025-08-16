import React, { useEffect } from "react";
import { useService } from "../../context";
import Loader from "../../components/Loader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const ProductionStock = () => {
  const { productions, getProductions, loading } = useService();

  useEffect(() => {
    getProductions();
  }, []);

  // Colors for summary cards and chart bars
  const summaryColors = {
    totalEggs: "border-blue-600",
    damagedEggs: "border-red-500",
    goodEggs: "border-green-600",
  };

  const barColor = "#22c55e"; // Green for good eggs

  // Calculate totals
  const totalEggs = productions.reduce((sum, p) => sum + Number(p.totalEggs), 0);
  const damagedEggs = productions.reduce((sum, p) => sum + Number(p.damagedEggs), 0);
  const goodEggs = totalEggs - damagedEggs;

  // Prepare chart data: good eggs per production date
  const chartData = productions.map((p) => ({
    date: new Date(p.date).toLocaleDateString(),
    goodEggs: p.totalEggs - p.damagedEggs,
  }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Egg Stock</h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-lg shadow-md border-t-4 ${summaryColors.totalEggs}`}>
              <h4 className="font-semibold text-gray-700">Total Eggs</h4>
              <p className="text-2xl font-bold text-blue-600">{totalEggs} Eggs</p>
            </div>
            <div className={`p-4 rounded-lg shadow-md border-t-4 ${summaryColors.damagedEggs}`}>
              <h4 className="font-semibold text-gray-700">Damaged Eggs</h4>
              <p className="text-2xl font-bold text-red-500">{damagedEggs} Eggs</p>
            </div>
            <div className={`p-4 rounded-lg shadow-md border-t-4 ${summaryColors.goodEggs}`}>
              <h4 className="font-semibold text-gray-700">Good Eggs</h4>
              <p className="text-2xl font-bold text-green-600">{goodEggs} Eggs</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="w-full h-96 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Good Eggs Per Production Date</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="goodEggs" barSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">No production records found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductionStock;
