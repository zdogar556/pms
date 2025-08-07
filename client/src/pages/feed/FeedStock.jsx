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

const FeedStock = () => {
  const {
    getFeeds,
    getFeedConsumptions,
    feed = [],
    feedConsumptions = [],
    loading,
  } = useService();

  useEffect(() => {
    getFeeds();
    getFeedConsumptions();
  }, []);

  const feedColors = {
    Starter: "border-blue-500",
    Grower: "border-green-500",
    Finisher: "border-yellow-500",
    Layer: "border-purple-500",
    Broiler: "border-pink-500",
    Medicated: "border-red-500",
  };

  const barColors = {
    Starter: "#3b82f6",
    Grower: "#22c55e",
    Finisher: "#eab308",
    Layer: "#a855f7",
    Broiler: "#ec4899",
    Medicated: "#ef4444",
  };

  // Calculate current stock per feed type
  const calculateNetStock = () => {
    const stock = {};
    feed.forEach((item) => {
      const type = item.feedType;
      const quantity = Number(item.quantity);
      if (!stock[type]) stock[type] = 0;
      stock[type] += quantity;
    });

    feedConsumptions.forEach((item) => {
      const type = item.feedType;
      const quantityUsed = Number(item.quantityUsed || item.quantity);
      if (!stock[type]) stock[type] = 0;
      stock[type] -= quantityUsed;
    });

    return stock;
  };

  const netStock = calculateNetStock();

  // Prepare chart data
  const chartData = Object.keys(feedColors).map((type) => ({
    feedType: type,
    quantity: netStock[type] > 0 ? netStock[type] : 0,
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Feed In Stock</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Cards */}
          <div className="flex flex-wrap gap-4 mb-8">
            {Object.keys(feedColors).map((type) => (
              <div
                key={type}
                className={`min-w-[200px] p-4 rounded-lg shadow-md border-t-4 ${feedColors[type]}`}
              >
                <h4 className="text-sm font-semibold">{type} Feed</h4>
                <p className="text-lg font-bold">
                  {netStock[type] && netStock[type] > 0
                    ? `${netStock[type]} Kg`
                    : "0 Kg"}
                </p>
              </div>
            ))}
          </div>

          {/* Bar Chart - Current Stock Only */}
          <div className="w-full h-96 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Feed Stock Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feedType" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[entry.feedType]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedStock;
