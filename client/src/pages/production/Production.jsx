import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

const Production = () => {
  const {
    loading,
    productions,
    getProductions,
    createProduction,
    getProductionById,
    deleteProduction,
    updateProduction,
    formatDate,
  } = useService();

  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("create");
  const [updateProductionId, setUpdateProductionId] = useState(null);
  const [newProduction, setNewProduction] = useState({
    date: "",
    totalEggs: "",
    damagedEggs: "",
  });
  const [errors, setErrors] = useState({});

  const validate = (name, value, updatedProduction) => {
    let error = "";

    const total = parseInt(updatedProduction.totalEggs || 0);
    const damaged = parseInt(updatedProduction.damagedEggs || 0);

    if (name === "date") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        error = "Date is not Valid.";
      }
    }

    if (name === "totalEggs") {
      if (value <= 0) {
        error = "Total eggs must be greater than 0.";
      } else if (damaged > value) {
        error = "Damaged eggs cannot exceed total eggs.";
      }
    }

    if (name === "damagedEggs") {
      if (value < 0) {
        error = "Damaged eggs cannot be negative.";
      } else if (value > total) {
        error = "Damaged eggs cannot exceed total eggs.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedProduction = { ...newProduction, [name]: value };
    setNewProduction(updatedProduction);
    validate(name, name === "date" ? value : parseInt(value), updatedProduction);
  };

  const handleProduction = async () => {
    if (Object.values(errors).some((e) => e)) return;

    if (actionType === "create") {
      await createProduction(newProduction);
    } else {
      await updateProduction(updateProductionId, newProduction);
    }

    setActionType("create");
    setModalOpen(false);
    setNewProduction({ date: "", totalEggs: "", damagedEggs: "" });
    setErrors({});
  };

  const handleEdit = async (id) => {
    const production = await getProductionById(id);
    setNewProduction({
      date: production.date
        ? new Date(production.date).toISOString().split("T")[0]
        : "",
      totalEggs: production.totalEggs || "",
      damagedEggs: production.damagedEggs || "",
    });
    setUpdateProductionId(production._id);
    setActionType("update");
    setModalOpen(true);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  useEffect(() => {
    getProductions();
  }, []);

  return (
    <div className="p-6 text-[0.828rem]">
      {loading && <Loader />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Production Management</h2>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => {
            setActionType("create");
            setNewProduction({ date: "", totalEggs: "", damagedEggs: "" });
            setErrors({});
            setModalOpen(true);
          }}
        >
          <FaPlus className="text-sm" />
          Add Production
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg whitespace-nowrap">
          <thead className="bg-[#2A2A40] text-white">
            <tr>
              <th className="px-4 py-3">Production Date</th>
              <th className="px-4 py-3">Total Eggs</th>
              <th className="px-4 py-3">Damaged Eggs</th>
              <th className="px-4 py-3">Good Eggs</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productions.length > 0 ? (
              productions.map((production) => (
                <tr
                  key={production._id}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="px-4 py-3 text-center">
                    {formatDate(production.date)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {production.totalEggs} Eggs
                  </td>
                  <td className="px-4 py-3 text-center">
                    {production.damagedEggs} Eggs
                  </td>
                  <td className="px-4 py-3 text-center">
                    {production.totalEggs - production.damagedEggs} Eggs
                  </td>
                  <td className="px-4 py-3 flex gap-2 text-center">
                    <button
                      onClick={() => handleEdit(production._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          window.confirm("Are you sure you want to delete?")
                        ) {
                          await deleteProduction(production._id);
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
                <td colSpan="5" className="text-center py-4">
                  No production records found.
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-base font-bold mb-6 text-gray-800">
                {actionType === "create"
                  ? "Add New Production"
                  : "Update Production"}
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <input
                    type="date"
                    name="date"
                    value={newProduction.date}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md focus:outline-none focus:ring-2 ${
                      errors.date
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    required
                  />
                  {errors.date && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.date}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <input
                    type="number"
                    name="totalEggs"
                    placeholder="Total Eggs"
                    value={newProduction.totalEggs}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md focus:outline-none focus:ring-2 ${
                      errors.totalEggs
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    required
                  />
                  {errors.totalEggs && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.totalEggs}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <input
                    type="number"
                    name="damagedEggs"
                    placeholder="Damaged Eggs"
                    value={newProduction.damagedEggs}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md focus:outline-none focus:ring-2 ${
                      errors.damagedEggs
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                    }`}
                    required
                  />
                  {errors.damagedEggs && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.damagedEggs}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    onClick={handleProduction}
                    disabled={Object.values(errors).some((e) => e)}
                  >
                    {actionType === "create" ? "Add" : "Update"}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    onClick={() => {
                      setModalOpen(false);
                      setErrors({});
                    }}
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

export default Production;
