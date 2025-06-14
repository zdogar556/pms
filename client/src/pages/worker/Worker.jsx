import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";

const Worker = () => {
  const {
    loading,
    workers,
    getWorkers,
    createWorker,
    getWorkerById,
    deleteWorker,
    updateWorker,
  } = useService();

  const [isModalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState("create");
  const [updateWorkerId, setUpdateWorkerId] = useState(null);
  const [newWorker, setNewWorker] = useState({
    name: "",
    role: "",
    salary: "",
    contact: "",
    shift: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker({ ...newWorker, [name]: value });
  };

  const handleWorker = async () => {
    if (actionType === "create") await createWorker(newWorker);
    else await updateWorker(updateWorkerId, newWorker);
    setActionType("create");
    setModalOpen(false);
    setNewWorker({
      name: "",
      role: "",
      salary: "",
      contact: "",
      shift: "",
    });
  };

  async function handleEdit(id) {
    if (id) {
      const worker = await getWorkerById(id);
      setNewWorker({
        name: worker.name || "",
        role: worker.role || "",
        salary: worker.salary || "",
        contact: worker.contact || "",
        shift: worker.shift || "",
      });
      setUpdateWorkerId(worker._id);
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
    getWorkers();
  }, []);

  return (
    <div className="p-6 text-[0.828rem]">
      {loading && <Loader />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Worker Management</h2>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus className="text-sm" />
          Add Worker
        </button>
      </div>

      <div id="overflow" className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg whitespace-nowrap">
          <thead className="bg-[#2A2A40] text-white">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.length > 0 &&
              workers.map((worker) => (
                <tr key={worker._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{worker.name}</td>
                  <td className="px-4 py-3">{worker.role}</td>
                  <td className="px-4 py-3">RS - {worker.salary}</td>
                  <td className="px-4 py-3">{worker.contact}</td>
                  <td className="px-4 py-3">{worker.shift}</td>

                  <td className="pl-12 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(worker._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={async () => {
                        if (
                          window.confirm("Are you sure you want to delete?")
                        ) {
                          await deleteWorker(worker._id);
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
        {workers.length === 0 && (
          <div className="w-full h-[50vh] flex justify-center items-center text-smfont-medium">
            No workers found
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
                {actionType === "create"
                  ? "Add New Volunteer"
                  : "Update Volunteer"}
              </h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newWorker.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  name="role"
                  value={newWorker.role}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-center bg-white p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">__Select Role__</option>
                  <option value="Farm Manager">Farm Manager</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="Hatchery Worker">Hatchery Worker</option>
                  <option value="Feed Specialist">Feed Specialist</option>
                  <option value="Poultry Caretaker">Poultry Caretaker</option>
                  <option value="Processing Worker">Processing Worker</option>
                </select>
                <input
                  type="number"
                  name="salary"
                  placeholder="Salary"
                  value={newWorker.salary}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact"
                  value={newWorker.contact}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <select
                  name="shift"
                  value={newWorker.shift}
                  onChange={handleInputChange}
                  className="border border-gray-300 text-center bg-white p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">__Select Shift__</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Afternoon</option>
                  <option value="Night">Night</option>
                </select>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                    onClick={handleWorker}
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

export default Worker;
