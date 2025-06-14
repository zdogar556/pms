import FeedConsumption from "../models/feedConsumption.model.js";
import Feed from "../models/feed.model.js";

// Create
export const createFeedConsumption = async (req, res) => {
  try {
    const feed = await Feed.findOne({ feedType: req.body.feedType });
    if (!feed) return res.status(404).json({ message: "Feed not found" });
    const feedConsumption = await FeedConsumption.create({ ...req.body, feedId: feed._id });
    res.status(201).json(feedConsumption);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
// Read All
export const getFeedConsumptions = async (req, res) => {
  try {
    const feeds = await FeedConsumption.find().sort({ date: -1 });
    const feedsWithType = await Promise.all(
      feeds.map(async (feed) => {
        const feedDetails = await Feed.findById(feed.feedId);
        return {
          ...feed.toObject(),
          feedType: feedDetails?.feedType || 'Unknown',
        };
      })
    );
    res.status(200).json(feedsWithType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read by ID
export const getFeedConsumptionById = async (req, res) => {
  try {
    const feed = await FeedConsumption.findById(req.params.id);
    if (!feed) return res.status(404).json({ message: "Not found" });
    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateFeedConsumption = async (req, res) => {
  try {
    const updated = await FeedConsumption.findByIdAndUpdate(
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
export const deleteFeedConsumption = async (req, res) => {
  try {
    const deleted = await FeedConsumption.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
