import React, { useEffect, useState } from "react";
import { useService } from "../../context";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const PoultryBatches = () => {
  const {
    batches,
    getBatches,
    createBatch,
    updateBatch,
    deleteBatch,
    getBatchById
  } = useService();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    batchName: "",
    type: "",
    quantity: "",
    startDate: "",
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);

  const handleInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (editingId) {
      await updateBatch(editingId, formData);
    } else {
      await createBatch(formData);
    }
    setModalOpen(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ batchName: "", type: "", quantity: "", startDate: "", notes: "" });
  };

  const openEdit = async (id) => {
    const batch = await getBatchById(id);
    setFormData({
      batchName: batch.batchName,
      type: batch.type,
      quantity: batch.quantity,
      startDate: new Date(batch.startDate).toISOString().split("T")[0],
      notes: batch.notes
    });
    setEditingId(id);
    setModalOpen(true);
  };

  useEffect(() => {
    getBatches();
  }, []);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="p-6 text-[0.828rem]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Poultry Batches</h2>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
        >
          <FaPlus className="text-sm" />
          Add Batch
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg whitespace-nowrap">
          <thead className="bg-[#2A2A40] text-white">
            <tr>
              <th className="px-4 py-3">Batch Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches?.length > 0 ? (
              batches.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{b.batchName}</td>
                  <td className="px-4 py-3">{b.type}</td>
                  <td className="px-4 py-3">{b.quantity}</td>
                  <td className="px-4 py-3">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{b.notes}</td>
                  <td className="px-4 py-3 flex space-x-2">
                    <button
                      onClick={() => openEdit(b._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        window.confirm("Are you sure?") && deleteBatch(b._id)
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
                <td colSpan="6" className="text-center py-8 text-sm font-medium">
                  No batches found.
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
                {editingId ? "Update Batch" : "Add New Batch"}
              </h3>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="batchName"
                  placeholder="Batch Name"
                  value={formData.batchName}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">__Select Type</option>
                  <option value="Broiler">Broiler</option>
                  <option value="Layer">Layer</option>
                </select>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="notes"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={handleInput}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

export default PoultryBatches;
