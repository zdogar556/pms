import Vaccination from "../models/vaccination.model.js";
import PoultryBatch from "../models/poultryBatch.model.js"; // import your batch model

// Get vaccinations by batch
export const getVaccinations = async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) return res.status(400).json({ message: "BatchId is required" });

    const vaccinations = await Vaccination.find({ batch: batchId });
    res.status(200).json({ vaccinations });
  } catch (error) {
    res.status(500).json({ message: "Error fetching vaccinations", error });
  }
};

// Create a new vaccination
export const createVaccination = async (req, res) => {
  try {
    const vaccination = new Vaccination(req.body);
    await vaccination.save();
    res.status(201).json({ message: "Vaccination created", vaccination });
  } catch (error) {
    res.status(500).json({ message: "Error creating vaccination", error });
  }
};

// Update vaccination (mark completed)
export const updateVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    const vaccination = await Vaccination.findByIdAndUpdate(id, req.body, { new: true });
    if (!vaccination) return res.status(404).json({ message: "Vaccination not found" });

    res.status(200).json({ message: "Vaccination updated", vaccination });
  } catch (error) {
    res.status(500).json({ message: "Error updating vaccination", error });
  }
};

// Delete vaccination
export const deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    await Vaccination.findByIdAndDelete(id);
    res.status(200).json({ message: "Vaccination deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vaccination", error });
  }
};

// Generate vaccination schedule for a batch
export const generateSchedule = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await PoultryBatch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    let schedule = [];
    if (batch.type === "Broiler") {
      schedule = [
        { day: 7, vaccineName: "Ranikhet" },
        { day: 14, vaccineName: "Gumboro" },
        { day: 21, vaccineName: "Ranikhet" },
      ];
    } else if (batch.type === "Layer") {
      schedule = [
        { day: 1, vaccineName: "Marek’s Disease" },
        { day: 7, vaccineName: "NDV" },
        { day: 10, vaccineName: "Fowl Pox" },
        { day: 21, vaccineName: "IBD" },
      ];
    }

    // Save schedule to DB
    const vaccinations = schedule.map((s) => ({
      batch: batchId,
      vaccineName: s.vaccineName,
      day: s.day,
      status: "Pending",
    }));

    const created = await Vaccination.insertMany(vaccinations);

    res.status(200).json({ vaccinations: created });
  } catch (error) {
    res.status(500).json({ message: "Error generating schedule", error });
  }
};
