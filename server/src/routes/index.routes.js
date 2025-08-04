import express from "express";
import {
  createPayroll,
  getPayrolls,
  getPayrollById,
  deletePayroll,
  updatePayroll,
} from "../controllers/payroll.controller.js";
import {
  createEggProduction,
  getEggProductions,
  getEggProductionById,
  deleteEggProduction,
  updateProduction,
} from "../controllers/production.controller.js";
import {
  createWorker,
  getWorkers,
  getWorkerById,
  updateWorker,
  deleteWorker,
} from "../controllers/worker.controller.js";
import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  updatePassword,
} from "../controllers/authentication.controller.js";
import {
  addFeed,
  deleteFeed,
  getAllFeeds,
  getFeedById,
  updateFeed,
} from "../controllers/feed.controller.js";
import {
  createFeedConsumption,
  getFeedConsumptions,
  getFeedConsumptionById,
  updateFeedConsumption,
  deleteFeedConsumption,
} from "../controllers/feedconsumption.controller.js"
import {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch
} from "../controllers/poultryBatch.controller.js";
import {
  createPoultryRecord,
  getPoultryRecords,
  getPoultryRecordById,
  updatePoultryRecord,
  deletePoultryRecord,
} from "../controllers/poultryRecord.controller.js";
import {
  createAttendance,
  getAttendances,
  getAttendanceByDateAndShift,
} from "../controllers/attendance.controller.js";

import verifyToken from "../middlewares/auth.middleware.js"
import { getInsights } from "../controllers/insight.controller.js";

const router = express.Router();

// Authentication
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);
router.get("/auth/logout", verifyToken, logoutAdmin);
router.patch("/auth/update/password", verifyToken, updatePassword);

// Insights
router.get("/insights", verifyToken, getInsights);

//  Feed Routes
router.post("/feed", verifyToken, addFeed);
router.get("/feed", verifyToken,   getAllFeeds);
router.get("/feed/:id", verifyToken, getFeedById);
router.patch("/feed/:id", verifyToken, updateFeed);
router.delete("/feed/:id", verifyToken, deleteFeed);

// 🐔 Feed Consumption Routes
router.post("/feedconsume", verifyToken, createFeedConsumption);
router.get("/feedconsume", verifyToken, getFeedConsumptions);
router.get("/feedconsume/:id", verifyToken, getFeedConsumptionById);
router.patch("/feedconsume/:id", verifyToken, updateFeedConsumption);
router.delete("/feedconsume/:id", verifyToken, deleteFeedConsumption);

// 🏦 Payroll Routes
router.post("/payroll", verifyToken, createPayroll);
router.get("/payroll", verifyToken, getPayrolls);
router.get("/payroll/:id", verifyToken, getPayrollById);
router.delete("/payroll/:id", verifyToken, deletePayroll);
router.patch("/payroll/:id", verifyToken, updatePayroll);

// 🥚 Egg Production Routes
router.post("/production", verifyToken, createEggProduction);
router.get("/production", verifyToken,   getEggProductions);
router.get("/production/:id", verifyToken,  getEggProductionById);
router.delete("/production/:id", verifyToken,  deleteEggProduction);
router.patch("/production/:id", verifyToken,  updateProduction);

// 👷 Worker Routes
router.post("/worker", verifyToken, createWorker);
router.get("/worker", verifyToken, getWorkers);
router.get("/worker/:id", verifyToken, getWorkerById);
router.patch("/worker/:id", verifyToken, updateWorker);
router.delete("/worker/:id", verifyToken, deleteWorker);

// 🐔 Poultry Batch
router.post("/batch", verifyToken, createBatch);
router.get("/batch", verifyToken, getBatches);
router.get("/batch/:id", verifyToken, getBatchById);
router.patch("/batch/:id", verifyToken, updateBatch);
router.delete("/batch/:id", verifyToken, deleteBatch);

// 🐔 Poultry Record
router.post("/poultryrecord", verifyToken, createPoultryRecord);
router.get("/poultryrecord", verifyToken, getPoultryRecords);
router.get("/poultryrecord/:id", verifyToken, getPoultryRecordById);
router.patch("/poultryrecord/:id", verifyToken, updatePoultryRecord);
router.delete("/poultryrecord/:id", verifyToken, deletePoultryRecord);
// ✅ Attendance Routes (define directly here)
router.post("/attendance", verifyToken, createAttendance);
router.get("/attendance", verifyToken, getAttendances);
router.get("/attendance/search", verifyToken, getAttendanceByDateAndShift);


export default router;
