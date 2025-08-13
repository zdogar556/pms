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
  const [validationErrors, setValidationErrors] = useState({});
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
    const updatedFeed = { ...newFeed, [name]: value };
    setNewFeed(updatedFeed);

    const errors = { ...validationErrors };

    if (name === "date") {
      const selected = new Date(value);
      const today = new Date();
      selected.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (selected > today) {
        errors.date = "Future date is not allowed.";
      } else {
        delete errors.date;
      }
    }

    if (name === "quantity" && Number(value) <= 0) {
      errors.quantity = "Quantity must be greater than 0.";
    } else if (name === "quantity") {
      delete errors.quantity;
    }

    if (name === "cost" && Number(value) <= 0) {
      errors.cost = "Cost must be greater than 0.";
    } else if (name === "cost") {
      delete errors.cost;
    }

    setValidationErrors(errors);
  };

  const handleFeed = async () => {
    const errors = {};
    if (!newFeed.feedType) errors.feedType = "Feed type is required.";
    if (!newFeed.date) errors.date = "Date is required.";
    if (Number(newFeed.quantity) <= 0) errors.quantity = "Quantity must be greater than 0.";
    if (Number(newFeed.cost) <= 0) errors.cost = "Cost must be greater than 0.";

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
    setValidationErrors({});
    getFeeds();
  };

  const handleEdit = async (id) => {
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
  };

  useEffect(() => {
    getFeeds();
  }, []);

  const feedColors = {
    Starter: "bg-blue-100 text-blue-800 border-blue-400",
    Grower: "bg-green-100 text-green-800 border-green-400",
    Finisher: "bg-yellow-100 text-yellow-800 border-yellow-400",
    Layer: "bg-purple-100 text-purple-800 border-purple-400",
    Broiler: "bg-pink-100 text-pink-800 border-pink-400",
    Medicated: "bg-red-100 text-red-800 border-red-400",
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="p-6 text-sm">
      {loading && <Loader />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Feed Management</h2>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
          onClick={() => {
            setActionType("create");
            setNewFeed({
              date: "",
              feedType: "",
              quantity: "",
              cost: "",
              supplier: "",
              notes: "",
            });
            setModalOpen(true);
          }}
        >
          <FaPlus className="text-sm" />
          Add Feed
        </button>
      </div>

      {/* 🔵 Feed Summary Cards - Responsive Layout */}
      <div className="grid gap-4 mb-6 pb-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
      {Object.keys(feedColors).map((type) => {
        const total = feed
      .filter((f) => f.feedType === type)
      .reduce((sum, f) => sum + Number(f.quantity), 0);
    return (
      <div
        key={type}
        className={`p-4 rounded-lg shadow-md border-t-4 ${feedColors[type]}`}
      >
        <h4 className="text-sm font-semibold">{type} Feed</h4>
        <p className="text-lg font-bold">{total} Kg</p>
      </div>
        );
      })}
      </div>


      {/* 🔶 Table of Feed Records */}
      <div className="overflow-x-auto">
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
            {feed.length > 0 ? (
              feed.map((f) => (
                <tr key={f._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3 text-center">{formatDate(f.date)}</td>
                  <td className="px-4 py-3 text-center">{f.feedType}</td>
                  <td className="px-4 py-3 text-center">{f.quantity}</td>
                  <td className="px-4 py-3 text-center">Rs - {f.cost}</td>
                  <td className="px-4 py-3 text-center">{f.supplier}</td>
                  <td className="px-4 py-3 text-center">{f.notes}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(f._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete?")) {
                          await deleteFeed(f._id);
                          getFeeds();
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No feed data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔘 Modal */}
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
              transition={{ duration: 0.3 }}
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
                  className={`border p-2.5 rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.date
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {validationErrors.date && (
                  <p className="text-red-600 text-xs mt-1">{validationErrors.date}</p>
                )}

                <select
                  name="feedType"
                  value={newFeed.feedType}
                  onChange={handleInputChange}
                  className="border border-gray-300 bg-white p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className={`border p-2.5 rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.quantity
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {validationErrors.quantity && (
                  <p className="text-red-600 text-xs mt-1">{validationErrors.quantity}</p>
                )}

                <input
                  type="number"
                  name="cost"
                  placeholder="Cost"
                  value={newFeed.cost}
                  onChange={handleInputChange}
                  className={`border p-2.5 rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.cost
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {validationErrors.cost && (
                  <p className="text-red-600 text-xs mt-1">{validationErrors.cost}</p>
                )}

                <input
                  type="text"
                  name="supplier"
                  placeholder="Supplier"
                  value={newFeed.supplier}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  value={newFeed.notes}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
                    onClick={handleFeed}
                  >
                    {actionType === "create" ? "Add" : "Update"}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all"
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