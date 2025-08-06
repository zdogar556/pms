import React, { useEffect } from "react";
import { useService } from "../../context";
import Loader from "../../components/Loader";

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

  // Calculate net stock = total feed added - total feed consumed
  const calculateNetStock = () => {
    const stock = {};

    // Step 1: Add feed quantities
    feed.forEach((item) => {
      const type = item.feedType;
      const quantity = Number(item.quantity);
      if (!stock[type]) {
        stock[type] = 0;
      }
      stock[type] += quantity;
    });

    // Step 2: Subtract consumed feed quantities
    feedConsumptions.forEach((item) => {
      const type = item.feedType; // assumes feedType is directly stored in feedConsumptions
      const quantityUsed = Number(item.quantityUsed || item.quantity);
      if (!stock[type]) {
        stock[type] = 0;
      }
      stock[type] -= quantityUsed;
    });

    return stock;
  };

  const netStock = calculateNetStock();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4"> Feed In Stock</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap gap-4">
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
      )}
    </div>
  );
};

export default FeedStock;
