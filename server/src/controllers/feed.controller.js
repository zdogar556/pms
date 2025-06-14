import Feed from "../models/feed.model.js";

// Add Feed Entry
export const addFeed = async (req, res) => {
  try {
    const { date, feedType, quantity, cost, supplier, notes } = req.body;
    const newFeed = new Feed({
      date,
      feedType,
      quantity,
      cost,
      supplier,
      notes,
    });
    await newFeed.save();
    res
      .status(201)
      .json({ message: "Feed entry added successfully", feed: newFeed });
  } catch (error) {
    res.status(500).json({ error: "Failed to add feed entry" });
  }
};

// Get All Feed Records
export const getAllFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find().sort({ date: -1 });
    res.status(200).json({ feeds });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feed records" });
  }
};

// Get Feed by ID
export const getFeedById = async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ error: "Feed record not found" });
    res.status(200).json({ feed });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feed record" });
  }
};

// Update Feed Entry
export const updateFeed = async (req, res) => {
  try {
    const updatedFeed = await Feed.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedFeed)
      return res.status(404).json({ error: "Feed record not found" });
    res
      .status(200)
      .json({ message: "Feed entry updated successfully", updatedFeed });
  } catch (error) {
    res.status(500).json({ error: "Failed to update feed entry" });
  }
};

// Delete Feed Entry
export const deleteFeed = async (req, res) => {
  try {
    const deletedFeed = await Feed.findByIdAndDelete(req.params.id);
    if (!deletedFeed)
      return res.status(404).json({ error: "Feed record not found" });
    res
      .status(200)
      .json({ message: "Feed entry deleted successfully", deletedFeed });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete feed entry" });
  }
};
