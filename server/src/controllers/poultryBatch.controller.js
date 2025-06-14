import PoultryBatch from "../models/poultryBatch.model.js";
import PoultryRecord from "../models/poultryRecord.model.js";

export const createBatch = async (req, res) => {
  try {
    const batch = new PoultryBatch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBatches = async (req, res) => {
  try {
    const batches = await PoultryBatch.find();
    
    // Get all batches with their poultry records
    const batchesWithCurrentQuantity = await Promise.all(batches.map(async (batch) => {
      const batchObj = batch.toObject();
      
      // Get total expired count from poultry records for this batch
      const totalExpired = await PoultryRecord.aggregate([
        { $match: { batchId: batch._id } },
        { $group: { _id: null, totalExpired: { $sum: "$expiredCount" } } }
      ]);

      // Calculate current quantity by subtracting total expired
      const expiredCount = totalExpired[0]?.totalExpired || 0;
      batchObj.currentQuantity = batch.quantity - expiredCount;

      return batchObj;
    }));

    res.status(200).json(batchesWithCurrentQuantity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBatchById = async (req, res) => {
  try {
    const batch = await PoultryBatch.findById(req.params.id);
    res.status(200).json(batch);
  } catch (err) {
    res.status(404).json({ error: "Batch not found" });
  }
};

export const updateBatch = async (req, res) => {
  try {
    const batch = await PoultryBatch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(batch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBatch = async (req, res) => {
  try {
    await PoultryBatch.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
