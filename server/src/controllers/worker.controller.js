import Worker from "../models/worker.model.js";

// Create Worker
export const createWorker = async (req, res) => {
  try {
    const { name, role, salary, contact, shift } = req.body;

    const worker = new Worker({ name, role, salary, contact, shift });
    await worker.save();

    res.status(201).json({ message: "Worker created successfully", worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Workers
export const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json({ workers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Worker
export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    res.status(200).json({ worker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Worker
export const updateWorker = async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWorker)
      return res.status(404).json({ message: "Worker not found" });

    res
      .status(200)
      .json({ message: "Worker updated successfully", updatedWorker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Worker
export const deleteWorker = async (req, res) => {
  try {
    const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Worker deleted successfully", deletedWorker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
