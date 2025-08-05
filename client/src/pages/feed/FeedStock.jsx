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
  };

  const calculateFeedInStock = () => {
    const stock = {};

    feed.forEach((item) => {
      if (!stock[item.feedType]) stock[item.feedType] = 0;
      stock[item.feedType] += Number(item.quantity);
    });

    feedConsumptions.forEach((item) => {
      if (!stock[item.feedType]) stock[item.feedType] = 0;
      stock[item.feedType] -= Number(item.quantityUsed);
    });

    return stock;
  };

  const feedStock = calculateFeedInStock();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📦 Feed In Stock</h2>
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
                {feedStock[type] ? `${feedStock[type]} Kg` : "0 Kg"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedStock;
