import EggProduction from "../models/production.model.js";

// ✅ Create Egg Production Record
export const createEggProduction = async (req, res) => {
  try {
    const { date, totalEggs, damagedEggs } = req.body;
    const goodEggs = totalEggs - damagedEggs;

    const eggProduction = new EggProduction({
      date,
      totalEggs,
      damagedEggs,
      goodEggs,
    });

    await eggProduction.save();

    res.status(201).json({
      message: "Production added successfully",
      production: eggProduction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Egg Production Records
export const getEggProductions = async (req, res) => {
  try {
    const productions = await EggProduction.find();
    res.status(200).json({ productions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Summary (Total, Damaged, Good)
export const getEggProductionSummary = async (req, res) => {
  try {
    const productions = await EggProduction.find();

    const totalEggs = productions.reduce((sum, p) => sum + p.totalEggs, 0);
    const damagedEggs = productions.reduce((sum, p) => sum + p.damagedEggs, 0);
    const goodEggs = productions.reduce((sum, p) => sum + p.goodEggs, 0);

    res.status(200).json({ totalEggs, damagedEggs, goodEggs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Egg Production Record
export const getEggProductionById = async (req, res) => {
  try {
    const production = await EggProduction.findById(req.params.id);
    if (!production)
      return res.status(404).json({ message: "Record not found" });

    res.status(200).json({ production });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Egg Production Record
export const deleteEggProduction = async (req, res) => {
  try {
    const deletedProduction = await EggProduction.findByIdAndDelete(
      req.params.id
    );
    res.status(200).json({
      message: "Egg production record deleted",
      deletedProduction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Production
export const updateProduction = async (req, res) => {
  try {
    const { totalEggs, damagedEggs } = req.body;
    const goodEggs = totalEggs - damagedEggs;

    const updatedProduction = await EggProduction.findByIdAndUpdate(
      req.params.id,
      { ...req.body, goodEggs },
      { new: true }
    );

    if (!updatedProduction)
      return res.status(404).json({ message: "Production not found" });

    res.status(200).json({
      message: "Production updated successfully",
      updatedProduction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
