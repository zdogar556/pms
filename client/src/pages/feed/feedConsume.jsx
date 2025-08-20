import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const FeedConsume = () => {
  const {
    loading,
    feed = [],
    feedConsumptions = [],
    getFeeds,
    getFeedConsumptions,
    createFeedConsumption,
    deleteFeedConsumption,
    updateFeedConsumption,
    formatDate,
  } = useService();

  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("create");
  const [updateId, setUpdateId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [newConsumption, setNewConsumption] = useState({
    date: "",
    feedType: "",
    quantityUsed: "",
    consumedBy: "",
    notes: "",
  });

  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...newConsumption, [name]: value };
    setNewConsumption(updated);

    const errors = { ...validationErrors };
    if (name === "date") {
      const selected = normalizeDate(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected > today) {
        errors.date = "Future date is not allowed.";
      } else {
        delete errors.date;
      }
    }
    if (name === "quantityUsed") {
      const qty = parseFloat(value);
      const available = getAvailableStock(newConsumption.feedType);
      if (qty > available) {
        errors.quantityUsed = `Only ${available} kg available in stock.`;
      } else {
        delete errors.quantityUsed;
      }
    }

    setValidationErrors(errors);
  };

  const getAvailableStock = (feedType) => {
    const purchased = feed
      .filter((f) => f.feedType === feedType)
      .reduce((acc, cur) => acc + (cur.quantity || 0), 0);

    const consumed = feedConsumptions
      .filter((f) => f.feedType === feedType)
      .reduce((acc, cur) => acc + (cur.quantityUsed || 0), 0);

    return purchased - consumed;
  };

  const handleSubmit = async () => {
    const errors = {};
    const selectedDate = normalizeDate(newConsumption.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!newConsumption.date) errors.date = "Date is required.";
    else if (selectedDate > today) errors.date = "Future date is not allowed.";

    if (!newConsumption.feedType) {
      errors.feedType = "Feed type is required.";
    }

    if (!newConsumption.quantityUsed) {
      errors.quantityUsed = "Quantity is required.";
    } else {
      const quantity = parseFloat(newConsumption.quantityUsed);
      const available = getAvailableStock(newConsumption.feedType);
      if (quantity > available) {
        errors.quantityUsed = `Only ${available} kg available in stock.`;
      }
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      date: newConsumption.date,
      feedType: newConsumption.feedType,
      quantityUsed: Number(newConsumption.quantityUsed),
      consumedBy: newConsumption.consumedBy,
      notes: newConsumption.notes,
    };

    if (actionType === "create") await createFeedConsumption(payload);
    else await updateFeedConsumption(updateId, payload);

    setActionType("create");
    setModalOpen(false);
    setNewConsumption({
      date: "",
      feedType: "",
      quantityUsed: "",
      consumedBy: "",
      notes: "",
    });
    setValidationErrors({});
    getFeedConsumptions();
    getFeeds(); // refresh stock after update
  };

  const handleEdit = (id) => {
    const consumption = feedConsumptions.find((item) => item._id === id);
    if (!consumption) return;

    setNewConsumption({
      date: consumption.date?.split("T")[0] || "",
      feedType: consumption.feedType || "",
      quantityUsed: consumption.quantityUsed,
      consumedBy: consumption.consumedBy,
      notes: consumption.notes,
    });

    setUpdateId(id);
    setActionType("update");
    setModalOpen(true);
  };

  const calculateFeedTotals = () => {
    const totals = {};
    feedConsumptions.forEach((item) => {
      if (!totals[item.feedType]) totals[item.feedType] = 0;
      totals[item.feedType] += item.quantityUsed;
    });
    return totals;
  };

  const feedTypeTotals = calculateFeedTotals();

  useEffect(() => {
    getFeedConsumptions();
    getFeeds();
  }, []);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="p-6 text-[0.828rem]">
      {loading && <Loader />}

      {/* Header + Buttons */}
      {/* Header + Buttons */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
  <h2 className="text-xl font-semibold">Feed Consumption</h2>

  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
    <button
      className="w-full sm:w-auto bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-all duration-300"
      onClick={() => navigate("/pms/feed-stock")}
    >
      View Feed Stock
    </button>
    <button
      className="w-full sm:w-auto bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
      onClick={() => {
        setModalOpen(true);
        setActionType("create");
        setNewConsumption({
          date: "",
          feedType: "",
          quantityUsed: "",
          consumedBy: "",
          notes: "",
        });
        setValidationErrors({});
      }}
    >
      <FaPlus className="text-sm" />
      Record Consumption
    </button>
  </div>
</div>


      {/* Summary Boxes */}
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
  {Object.entries(feedTypeTotals).map(([type, total]) => (
    <div
      key={type}
      className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-600"
    >
      <h4 className="text-sm font-semibold text-gray-700">{type} Feed</h4>
      <p className="text-lg font-bold text-blue-700">{total} kg</p>
    </div>
  ))}
</div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg whitespace-nowrap">
          <thead className="bg-[#2A2A40] text-white">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Feed Type</th>
              <th className="px-4 py-3">Quantity(kg)</th>
              <th className="px-4 py-3">Consumed By</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedConsumptions.length > 0 ? (
              feedConsumptions.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3 text-center">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 text-center">{item.feedType}</td>
                  <td className="pl-9 py-3 text-center">{item.quantityUsed}</td>
                  <td className="px-4 py-3 text-center">{item.consumedBy}</td>
                  <td className="px-4 py-3 text-center">{item.notes}</td>
                  <td className="pl-12 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete?")) {
                          await deleteFeedConsumption(item._id);
                          getFeedConsumptions();
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
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No feed consumption records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
  {actionType === "create" ? "Record Consumption" : "Update Consumption"}
</h3>

<div className="space-y-4">
  {/* Date */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
    <input
      type="date"
      name="date"
      value={newConsumption.date}
      onChange={handleInputChange}
      className={`w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 ${
        validationErrors.date
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      }`}
    />
    {validationErrors.date && (
      <p className="text-red-600 text-xs mt-1">{validationErrors.date}</p>
    )}
  </div>

  {/* Feed Type */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Feed Type</label>
    <select
      name="feedType"
      value={newConsumption.feedType}
      onChange={handleInputChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">__Select Feed Type</option>
      <option value="Starter">Starter Feed</option>
      <option value="Grower">Grower Feed</option>
      <option value="Finisher">Finisher Feed</option>
      <option value="Layer">Layer Feed</option>
      <option value="Broiler">Broiler Feed</option>
      <option value="Medicated">Medicated Feed</option>
    </select>
  </div>

  {/* Quantity Used */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Quantity Used (kg)</label>
    <input
      type="number"
      name="quantityUsed"
      placeholder="Enter quantity"
      value={newConsumption.quantityUsed}
      onChange={handleInputChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {validationErrors.quantityUsed && (
      <p className="text-red-600 text-xs mt-1">{validationErrors.quantityUsed}</p>
    )}
  </div>

  {/* Consumed By */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Consumed By</label>
    <input
      type="text"
      name="consumedBy"
      placeholder="Enter person or group"
      value={newConsumption.consumedBy}
      onChange={handleInputChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Notes */}
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
    <input
      type="text"
      name="notes"
      placeholder="Additional notes"
      value={newConsumption.notes}
      onChange={handleInputChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-3 pt-4">
    <button
      className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm hover:bg-blue-700"
      onClick={handleSubmit}
    >
      {actionType === "create" ? "Record" : "Update"}
    </button>
    <button
      className="bg-gray-500 text-white px-5 py-2.5 rounded-md text-sm hover:bg-gray-600"
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

export default FeedConsume;
