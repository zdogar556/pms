import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useService } from "../../context";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const [salaryError, setSalaryError] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: "",
    role: "",
    salary: "",
    contact: "",
    shift: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker({ ...newWorker, [name]: value });

    if (name === "salary") {
      const salary = parseFloat(value);
      setSalaryError(salary <= 0 || isNaN(salary));
    }
  };

  const handleWorker = async () => {
    const salary = parseFloat(newWorker.salary);

    if (
      !newWorker.name ||
      !newWorker.role ||
      !newWorker.salary ||
      !newWorker.contact ||
      !newWorker.shift ||
      salary <= 0
    ) {
      setSalaryError(salary <= 0);
      alert("Please fill all fields correctly. Salary must be greater than 0.");
      return;
    }

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
    setSalaryError(false);
  };

  const handleEdit = async (id) => {
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
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  useEffect(() => {
    getWorkers();
  }, []);

  return (
    <div className="p-6 text-sm">
      {loading && <Loader />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Worker Management</h2>
        <div className="flex gap-4">
          <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
            onClick={() => navigate("/pms/attendance")}
            >
              Attendance
            </button>
        <button
          className="bg-[#2A2A40] text-white px-6 py-2 rounded-lg hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus className="text-sm" />
          Add Worker
        </button>

        </div>
        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg whitespace-nowrap">
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
            {workers.length > 0 ? (
              workers.map((worker) => (
                <tr key={worker._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3 text-center">{worker.name}</td>
                  <td className="px-4 py-3 text-center">{worker.role}</td>
                  <td className="px-4 py-3 text-center">Rs - {worker.salary}</td>
                  <td className="px-4 py-3 text-center">{worker.contact}</td>
                  <td className="px-4 py-3 text-center">{worker.shift}</td>
                  <td className="pl-12 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(worker._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete?")) {
                          await deleteWorker(worker._id);
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
                <td colSpan="6" className="text-center py-6 text-gray-600">
                  No workers found
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
                {actionType === "create" ? "Add New Worker" : "Update Worker"}
              </h3>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newWorker.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="role"
                  value={newWorker.role}
                  onChange={handleInputChange}
                  className="border border-gray-300 bg-white p-2.5 rounded-md text-center focus:ring-2 focus:ring-blue-500"
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
                  className={`border p-2.5 rounded-md focus:ring-2 ${
                    salaryError
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {salaryError && (
                  <p className="text-red-600 text-sm -mt-2">
                    Salary must be greater than 0
                  </p>
                )}
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact"
                  value={newWorker.contact}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2.5 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="shift"
                  value={newWorker.shift}
                  onChange={handleInputChange}
                  className="border border-gray-300 bg-white p-2.5 rounded-md text-center focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">__Select Shift__</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Afternoon</option>
                  <option value="Night">Night</option>
                </select>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    onClick={handleWorker}
                  >
                    {actionType === "create" ? "Add" : "Update"}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
                    onClick={() => {
                      setModalOpen(false);
                      setSalaryError(false);
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

export default Worker;
