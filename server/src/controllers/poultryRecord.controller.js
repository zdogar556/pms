import PoultryRecord from "../models/poultryRecord.model.js";
import PoultryBatch from "../models/poultryBatch.model.js";

// Create
export const createPoultryRecord = async (req, res) => {
  try {
    const batch = await PoultryBatch.findById(req.body.batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    const poultryRecord = await PoultryRecord.create({ ...req.body, batchId: batch._id });
    res.status(201).json(poultryRecord);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
// Read All
export const getPoultryRecords = async (req, res) => {
  try {
    const poultryRecords = await PoultryRecord.find().sort({ date: -1 });
    const poultryRecordsWithType = await Promise.all(
      poultryRecords.map(async (poultryRecord) => {
        const poultryRecordDetails = await PoultryBatch.findById(poultryRecord.batchId);
        return {
          ...poultryRecord.toObject(),
          batchName: poultryRecordDetails?.batchName || 'Unknown',
        };
      })
    );
    res.status(200).json(poultryRecordsWithType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read by ID
export const getPoultryRecordById = async (req, res) => {
  try {
    const poultryRecord = await PoultryRecord.findById(req.params.id);
    if (!poultryRecord) return res.status(404).json({ message: "Not found" });
    res.status(200).json(poultryRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updatePoultryRecord = async (req, res) => {
  try {
    const updated = await PoultryRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deletePoultryRecord = async (req, res) => {
  try {
    const deleted = await PoultryRecord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
