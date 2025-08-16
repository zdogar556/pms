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
  const { productions, payrolls, getProductions, getPayrolls, loading } = useService();

  useEffect(() => {
    getProductions();
    getPayrolls(); // ✅ fetch payrolls too
  }, []);

  const barColor = "#22c55e"; // Green for good eggs

  // Calculate totals
  const totalEggs = productions.reduce((sum, p) => sum + Number(p.totalEggs), 0);
  const damagedEggs = productions.reduce((sum, p) => sum + Number(p.damagedEggs), 0);
  const goodEggs = totalEggs - damagedEggs;

  // ✅ subtract sold eggs from payroll
  const soldEggs = payrolls.reduce((sum, pr) => sum + Number(pr.eggsSold || 0), 0);
  const availableGoodEggs = goodEggs - soldEggs;

  // ✅ Chart shows running stock (after sales)
  const productionByDate = productions.reduce((acc, p) => {
    const date = new Date(p.date).toLocaleDateString();
    const goodEggs = p.totalEggs - p.damagedEggs;
    acc[date] = (acc[date] || 0) + goodEggs;
    return acc;
  }, {});

  const payrollByDate = payrolls.reduce((acc, pr) => {
    const date = new Date(pr.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + Number(pr.eggsSold || 0);
    return acc;
  }, {});

  let runningStock = 0;
  const chartData = Object.keys(productionByDate)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => {
      runningStock += productionByDate[date]; // add produced good eggs
      runningStock -= payrollByDate[date] || 0; // subtract sold eggs
      return { date, stock: runningStock };
    });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Egg Stock</h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* ✅ Only Available Stock Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg shadow-md border-t-4 border-green-600">
          <h4 className="font-semibold text-gray-700">Available Eggs</h4>
          <p className="text-2xl font-bold text-green-600">{availableGoodEggs} Eggs</p>
          </div>
  
          <div className="p-4 rounded-lg shadow-md border-t-4 border-blue-600">
          <h4 className="font-semibold text-gray-700">Sold Eggs</h4>
          <p className="text-2xl font-bold text-blue-600">{soldEggs} Eggs</p>
          </div>

          <div className="p-4 rounded-lg shadow-md border-t-4 border-red-600">
          <h4 className="font-semibold text-gray-700">Damaged Eggs</h4>
          <p className="text-2xl font-bold text-red-600">{damagedEggs} Eggs</p>
          </div>
          </div>


          {/* ✅ Stock Chart */}
          <div className="w-full h-96 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Stock Over Time</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" barSize={50}>
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
