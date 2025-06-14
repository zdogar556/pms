import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

const Payroll = () => {
  const {
    loading,
    payrolls,
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
  const [newPayroll, setNewPayroll] = useState({
    date: "",
    eggsSold: "",
    pricePerEgg: "",
    totalExpense: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayroll({ ...newPayroll, [name]: value });
  };

  const handleFeed = async () => {
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
  };

  async function handleEdit(id) {
    if (id) {
      const payroll = await getPayrollById(id);
      setNewPayroll({
        date: payroll.date
          ? new Date(payroll.date).toISOString().split("T")[0]
          : "",
        eggsSold: payroll.eggsSold || "",
        pricePerEgg: payroll.pricePerEgg || "",
        totalExpense: payroll.totalExpense || "",
      });
      setUpdatePayrollId(payroll._id);
      setActionType("update");
      setModalOpen(true);
    }
  }

  // Animation variants for the modal
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  useEffect(() => {
    getPayrolls();
  }, []);

  return (
    <div className="p-6 text-[0.828rem]">
      {loading && <Loader />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Payroll Management</h2>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus className="text-sm" />
          Add Payroll
        </button>
      </div>

      <div id="overflow" className="overflow-x-auto">
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
            {payrolls.length > 0 &&
              payrolls.map((payroll) => (
                <tr key={payroll._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{formatDate(payroll.date)}</td>
                  <td className="px-4 py-3">{payroll.eggsSold}</td>
                  <td className="px-4 py-3">RS - {payroll.pricePerEgg}</td>
                  <td className="px-4 py-3">RS - {payroll.totalExpense}</td>
                  <td className="px-4 py-3">RS - {payroll.totalRevenue}</td>
                  <td className="px-4 py-3">RS - {payroll.totalSalaries}</td>
                  <td className="px-4 py-3">RS - {payroll.netProfit}</td>

                  <td className="pl-12 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(payroll._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          window.confirm("Are you sure you want to delete?")
                        ) {
                          await deletePayroll(payroll._id);
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
        {payrolls.length === 0 && (
          <div className="w-full h-[50vh] flex justify-center items-center text-smfont-medium">
            No payrolls found
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
                {actionType === "create" ? "Add New Payroll" : "Update Payroll"}
              </h3>

              <div className="flex flex-col gap-4">
                <input
                  type="date"
                  name="date"
                  value={newPayroll.date}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="eggsSold"
                  placeholder="Eggs Sold"
                  value={newPayroll.eggsSold}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="pricePerEgg"
                  placeholder="Price Per Egg"
                  value={newPayroll.pricePerEgg}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="totalExpense"
                  placeholder="Total Expenses"
                  value={newPayroll.totalExpense}
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

export default Payroll;
