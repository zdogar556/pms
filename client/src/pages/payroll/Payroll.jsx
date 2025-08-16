import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

const Payroll = () => {
  const {
    loading,
    payrolls,
    productions,       // ✅ bring productions
    getProductions,    // ✅ fetch productions
    getPayrolls,
    createPayroll,
    getPayrollById,
    deletePayroll,
    updatePayroll,
    formatDate,
  } = useService();

  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("create");
  const [updatePayrollId, setUpdatePayrollId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [newPayroll, setNewPayroll] = useState({
    date: "",
    eggsSold: "",
    pricePerEgg: "",
    totalExpense: "",
  });

  // ✅ normalize date
  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // ✅ calculate available eggs
  // ✅ calculate available eggs in stock
const getGoodEggsInStock = (excludeId = null) => {
  const totalEggs = productions.reduce((sum, p) => sum + Number(p.totalEggs || 0), 0);
  const damagedEggs = productions.reduce((sum, p) => sum + Number(p.damagedEggs || 0), 0);
  const goodEggs = totalEggs - damagedEggs;

  let alreadySold = payrolls.reduce((sum, pr) => sum + Number(pr.eggsSold || 0), 0);

  // ✅ if editing, add back the eggsSold of the record being edited
  if (excludeId) {
    const record = payrolls.find((pr) => pr._id === excludeId);
    if (record) {
      alreadySold -= Number(record.eggsSold || 0);
    }
  }

  return goodEggs - alreadySold;
};


  // ✅ input change handler with validations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    const errors = { ...validationErrors };

    if (name === "date") {
      const selectedDate = normalizeDate(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.date = "Future dates are not allowed.";
      } else {
        delete errors.date;
      }
    }

    if (["eggsSold", "pricePerEgg", "totalExpense"].includes(name)) {
      if (numericValue <= 0 || isNaN(numericValue)) {
        errors[name] = `${name.replace(/([A-Z])/g, " $1")} must be greater than 0.`;
      } else {
        delete errors[name];
      }
    }

    // ✅ stock validation for eggsSold
    if (name === "eggsSold") {
  const availableGoodEggs = getGoodEggsInStock(
    actionType === "update" ? updatePayrollId : null
  );

  if (numericValue > availableGoodEggs) {
    errors.eggsSold = `Not enough stock. Available: ${availableGoodEggs}`;
  } else {
    delete errors.eggsSold;
  }
}


    setValidationErrors(errors);
    setNewPayroll({ ...newPayroll, [name]: value });
  };

  const handleFeed = async () => {
    const hasErrors = Object.values(validationErrors).some((err) => err);
    if (hasErrors) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    if (actionType === "create") await createPayroll(newPayroll);
    else await updatePayroll(updatePayrollId, newPayroll);

    setActionType("create");
    setModalOpen(false);
    setNewPayroll({
      date: "",
      eggsSold: "",
      pricePerEgg: "",
      totalExpense: "",
    });
    setValidationErrors({});
    getPayrolls();
  };

  async function handleEdit(id) {
    if (id) {
      const payroll = await getPayrollById(id);
      setNewPayroll({
        date: payroll.date ? new Date(payroll.date).toISOString().split("T")[0] : "",
        eggsSold: payroll.eggsSold || "",
        pricePerEgg: payroll.pricePerEgg || "",
        totalExpense: payroll.totalExpense || "",
      });
      setUpdatePayrollId(payroll._id);
      setActionType("update");
      setModalOpen(true);
    }
  }

  useEffect(() => {
    getPayrolls();
    getProductions(); // ✅ fetch stock
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
        <h2 className="text-xl font-semibold">Payroll Management</h2>
        <button
          className="bg-[#2A2A40] text-white flex px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus className="mr-2 mt-1" /> Add Payroll
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg whitespace-nowrap">
          <thead className="bg-[#2A2A40] text-white">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Eggs Sold</th>
              <th className="px-4 py-3">Price per egg</th>
              <th className="px-4 py-3">Total Expense</th>
              <th className="px-4 py-3">Total Revenue</th>
              <th className="px-4 py-3">Total Salaries</th>
              <th className="px-4 py-3">Net Profit</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.length > 0 ? (
              [...payrolls]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((payroll) => (
                  <tr key={payroll._id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-3 text-center">{formatDate(payroll.date)}</td>
                    <td className="px-4 py-3 text-center">{payroll.eggsSold}</td>
                    <td className="px-4 py-3 text-center">RS - {payroll.pricePerEgg}</td>
                    <td className="px-4 py-3 text-center">RS - {payroll.totalExpense}</td>
                    <td className="px-4 py-3 text-center">RS - {payroll.totalRevenue}</td>
                    <td className="px-4 py-3 text-center">RS - {payroll.totalSalaries}</td>
                    <td className="px-4 py-3 text-center">RS - {payroll.netProfit}</td>
                    <td className="pl-12 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(payroll._id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete?")) {
                            await deletePayroll(payroll._id);
                            getPayrolls();
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
                <td colSpan="8" className="text-center py-8 text-sm font-medium">
                  No payrolls found
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
            initial="hidden"
            animate="visible"
            exit="exit"
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
                {actionType === "create" ? "Add New Payroll" : "Update Payroll"}
              </h3>

              {/* ✅ Show available stock */}
              {/* <p className="text-sm text-gray-600 mb-2">
                Available Good Eggs: <span className="font-bold">{getGoodEggsInStock()}</span>
              </p> */}

              <div className="flex flex-col gap-4">
                {/* Date */}
                <div>
                  <input
                    type="date"
                    name="date"
                    value={newPayroll.date}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md w-full ${
                      validationErrors.date ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {validationErrors.date && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.date}</p>
                  )}
                </div>

                {/* Eggs Sold */}
                <div>
                  <input
                    type="number"
                    name="eggsSold"
                    placeholder="Eggs Sold"
                    value={newPayroll.eggsSold}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md w-full ${
                      validationErrors.eggsSold ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {validationErrors.eggsSold && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.eggsSold}</p>
                  )}
                </div>

                {/* Price Per Egg */}
                <div>
                  <input
                    type="number"
                    name="pricePerEgg"
                    placeholder="Price Per Egg"
                    value={newPayroll.pricePerEgg}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md w-full ${
                      validationErrors.pricePerEgg ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {validationErrors.pricePerEgg && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.pricePerEgg}</p>
                  )}
                </div>

                {/* Total Expense */}
                <div>
                  <input
                    type="number"
                    name="totalExpense"
                    placeholder="Total Expenses"
                    value={newPayroll.totalExpense}
                    onChange={handleInputChange}
                    className={`border p-2.5 rounded-md w-full ${
                      validationErrors.totalExpense ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {validationErrors.totalExpense && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.totalExpense}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    onClick={handleFeed}
                  >
                    {actionType === "create" ? "Add" : "Update"}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
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

export default Payroll;
