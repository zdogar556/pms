import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useService } from "../../context";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "../../components/Loader";

const PoultryBatchRecord = () => {
  const { batchId } = useParams();
  const {
    loading,
    getBatchById,
    getPoultryRecords,
    poultryRecords,
    formatDate,
    createPoultryRecord,
    updatePoultryRecord,
    deletePoultryRecord
  } = useService();

  const [batch, setBatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    expiredCount: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const batchData = await getBatchById(batchId);
      setBatch(batchData);
      await getPoultryRecords();
    };
    fetchData();
  }, [batchId]);

  const handleInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update record
        await updatePoultryRecord(editingId, formData);
      } else {
        // Create new record
        await createPoultryRecord({ ...formData, batchId });
      }
      setModalOpen(false);
      setEditingId(null);
      resetForm();
      await getPoultryRecords();
    } catch (error) {
      console.error("Error submitting record:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      expiredCount: "",
      notes: "",
    });
  };

  const openEdit = (record) => {
    setFormData({
      date: new Date(record.date).toISOString().split("T")[0],
      expiredCount: record.expiredCount,
      notes: record.notes || "",
    });
    setEditingId(record._id);
    setModalOpen(true);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  // Filter records for this batch
  const batchRecords = poultryRecords?.filter(
    (record) => record?.batchId === batchId
  ) || [];

  return (
    <div className="p-6 text-[0.828rem]">
      {loading && <Loader />}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Poultry Batch Records</h2>
          {batch && (
            <p className="text-sm text-gray-600 mt-1">
              Batch: {batch.batchName} ({batch.type})
            </p>
          )}
        </div>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          <FaPlus className="text-sm" />
          Add Record
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg whitespace-nowrap">
          <thead className="bg-[#2A2A40] text-white">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Expired Count</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batchRecords.length > 0 ? (
              batchRecords.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3 text-center">{formatDate(record.date)}</td>
                  <td className="px-4 py-3 text-center">{record.expiredCount}</td>
                  <td className="px-4 py-3 text-center">{record.notes}</td>
                  <td className="px-4 py-3 text-center flex space-x-2">
                    <button
                      onClick={() => openEdit(record)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        window.confirm("Are you sure?") &&
                        deletePoultryRecord(record._id)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-sm font-medium">
                  No records found for this batch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
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
                {editingId ? "Update Record" : "Add New Record"}
              </h3>

              <div className="flex flex-col gap-4">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  name="expiredCount"
                  placeholder="Expired Count"
                  value={formData.expiredCount}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <textarea
                  name="notes"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    onClick={handleSubmit}
                  >
                    {editingId ? "Update" : "Add"}
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

export default PoultryBatchRecord;
