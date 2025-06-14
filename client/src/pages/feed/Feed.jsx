import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

const Feed = () => {
  const {
    loading,
    feed,
    getFeeds,
    createFeed,
    getFeedById,
    deleteFeed,
    updateFeed,
    formatDate,
  } = useService();

  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("create");
  const [updateFeedId, setUpdateFeedId] = useState(null);
  const [feedTotals, setFeedTotals] = useState({}); // NEW STATE

  const [newFeed, setNewFeed] = useState({
    date: "",
    feedType: "",
    quantity: "",
    cost: "",
    supplier: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeed({ ...newFeed, [name]: value });
  };

  const handleFeed = async () => {
    if (actionType === "create") await createFeed(newFeed);
    else await updateFeed(updateFeedId, newFeed);
    setActionType("create");
    setModalOpen(false);
    setNewFeed({
      date: "",
      feedType: "",
      quantity: "",
      cost: "",
      supplier: "",
      notes: "",
    });
    getFeeds(); // Refresh feed list and totals
  };

  async function handleEdit(id) {
    if (id) {
      const feed = await getFeedById(id);
      setNewFeed({
        date: feed.date ? new Date(feed.date).toISOString().split("T")[0] : "",
        feedType: feed.feedType || "",
        quantity: feed.quantity || "",
        cost: feed.cost || "",
        supplier: feed.supplier || "",
        notes: feed.notes || "",
      });
      setUpdateFeedId(feed._id);
      setActionType("update");
      setModalOpen(true);
    }
  }

  // Calculate total quantity for each feed type
  const calculateFeedTotals = (feeds) => {
    const totals = {};
    feeds.forEach((f) => {
      if (totals[f.feedType]) {
        totals[f.feedType] += f.quantity;
      } else {
        totals[f.feedType] = f.quantity;
      }
    });
    setFeedTotals(totals);
  };

  useEffect(() => {
    async function fetchData() {
      await getFeeds();
    }
    fetchData();
  }, []);

  useEffect(() => {
    calculateFeedTotals(feed);
  }, [feed]);

  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="p-6 text-[0.828rem]">
      {loading && <Loader />}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Feed Management</h2>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus className="text-sm" />
          Add Feed
        </button>
      </div>

      {/* Feed Totals Display */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-inner text-sm text-gray-800 space-y-1">
        <h3 className="font-semibold mb-1">Feed Type Totals:</h3>
        {Object.keys(feedTotals).length > 0 ? (
          Object.entries(feedTotals).map(([type, total]) => (
            <div key={type}>
              {type} Feed: <strong>{total} Kg</strong>
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>

      <div id="overflow" className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg whitespace-nowrap">
          <thead className="bg-[#2A2A40] text-white">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Feed Type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feed.length > 0 &&
              feed.map((feed) => (
                <tr key={feed._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{formatDate(feed.date)}</td>
                  <td className="px-4 py-3">{feed.feedType}</td>
                  <td className="pl-9 py-3">{feed.quantity}</td>
                  <td className="px-4 py-3">RS - {feed.cost}</td>
                  <td className="px-4 py-3">{feed.supplier}</td>
                  <td className="px-4 py-3">{feed.notes}</td>
                  <td className="pl-12 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(feed._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete?")) {
                          await deleteFeed(feed._id);
                          getFeeds(); // Refresh after delete
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {feed.length === 0 && (
          <div className="w-full h-[50vh] flex justify-center items-center text-sm font-medium">
            No feed found
          </div>
        )}
      </div>

      {/* Modal with Framer Motion */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg w-96 shadow-xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-base font-bold mb-6 text-gray-800">
                {actionType === "create" ? "Add New Feed" : "Update Feed"}
              </h3>

              <div className="flex flex-col gap-4">
                <input
                  type="date"
                  name="date"
                  value={newFeed.date}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <select
                  name="feedType"
                  value={newFeed.feedType}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-center bg-white p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">__Select Feed Type</option>
                  <option value="Starter">Starter Feed</option>
                  <option value="Grower">Grower Feed</option>
                  <option value="Finisher">Finisher Feed</option>
                  <option value="Layer">Layer Feed</option>
                  <option value="Broiler">Broiler Feed</option>
                  <option value="Medicated">Medicated Feed</option>
                </select>

                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity in Kgs"
                  value={newFeed.quantity}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="cost"
                  placeholder="Cost"
                  value={newFeed.cost}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="supplier"
                  placeholder="Supplier"
                  value={newFeed.supplier}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  value={newFeed.notes}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    onClick={handleFeed}
                  >
                    {actionType === "create" ? "Add" : "Update"}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
