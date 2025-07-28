import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

const FeedConsume = () => {
  const {
    loading,
    feedConsumptions = [],
    getFeedConsumptions,
    createFeedConsumption,
    getFeedConsumptionById,
    deleteFeedConsumption,
    updateFeedConsumption,
    formatDate,
  } = useService();

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

    setValidationErrors(errors);
  };

  const handleSubmit = async () => {
    const errors = {};
    const selectedDate = normalizeDate(newConsumption.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!newConsumption.date) errors.date = "Date is required.";
    else if (selectedDate > today) errors.date = "Future date is not allowed.";

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
  };

  const handleEdit = (id) => {
  const consumption = feedConsumptions.find((item) => item._id === id);
  if (!consumption) return;

  setNewConsumption({
    date: consumption.date?.split("T")[0] || "",
    feedType: consumption.feedType || "", // ✅ This now exists
    quantityUsed: consumption.quantityUsed,
    consumedBy: consumption.consumedBy,
    notes: consumption.notes,
  });

  setUpdateId(id);
  setActionType("update");
  setModalOpen(true);
};


  useEffect(() => {
    getFeedConsumptions();
  }, []);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="p-6 text-[0.828rem]">
      {loading && <Loader />}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Feed Consumption</h2>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
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
            {Array.isArray(feedConsumptions) && feedConsumptions.length > 0 ? (
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
                {actionType === "create" ? "Record Consumption" : "Update Consumption"}
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <input
                    type="date"
                    name="date"
                    value={newConsumption.date}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md focus:outline-none focus:ring-2 ${
                      validationErrors.date
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    required
                  />
                  {validationErrors.date && (
                    <p className="text-red-600 text-xs mt-1">{validationErrors.date}</p>
                  )}
                </div>

                <select
                  name="feedType"
                  value={newConsumption.feedType}
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
                  name="quantityUsed"
                  placeholder="Quantity in Kgs"
                  value={newConsumption.quantityUsed}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  name="consumedBy"
                  placeholder="Consumed By"
                  value={newConsumption.consumedBy}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  value={newConsumption.notes}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    onClick={handleSubmit}
                  >
                    {actionType === "create" ? "Record" : "Update"}
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

export default FeedConsume;
