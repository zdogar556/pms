import axios from "axios";
import { toast } from "react-hot-toast";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
  // Configurations
  const navigate = useNavigate();
  const URL = "http://localhost:3000/api";
  const token = localStorage.getItem("token") || null;
  const resolver = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const mutation = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // PMS States
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [feed, setFeed] = useState([]);
  const [feedConsumption, setFeedConsumption] = useState([]);
  const [feedConsumptions, setFeedConsumptions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [productions, setProductions] = useState([]);
  const [poultryRecords, setPoultryRecords] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loggedInUser, setloggedInUser] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  );

  // Authentication
  const register = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${URL}/auth/register`,
        credentials,
        mutation
      );
      navigate("/");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${URL}/auth/login`,
        credentials,
        mutation
      );
      setloggedInUser(data.admin);
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      navigate("/pms");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/auth/logout`, mutation);
      setloggedInUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${URL}/auth/update/password`,
        credentials,
        mutation
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Insights Management
  const getInsights = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/insights`, resolver);
      setInsights(data.insights);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Worker Management
  const getWorkers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/worker`, resolver);
      setWorkers(data.workers);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getWorkerById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/worker/${id}`, resolver);
      return data.worker;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createWorker = async (worker) => {
    try {
      setLoading(true);
      console.log(worker);
      const { data } = await axios.post(`${URL}/worker`, worker, mutation);
      setWorkers([...workers, data.worker]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${URL}/worker/${id}`, mutation);
      setWorkers(workers.filter((item) => item._id !== data.deletedWorker._id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateWorker = async (id, worker) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${URL}/worker/${id}`,
        worker,
        mutation
      );
      const spread = [...workers];
      const index = spread.findIndex(
        (item) => item._id === data.updatedWorker._id
      );
      spread[index] = data.updatedWorker;
      setWorkers(spread);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
// ATTENDANCE SERVICES

const getAttendance = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/attendance`, resolver);
    setAttendance(data.attendance);
  } catch (error) {
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

const getAttendanceById = async (id) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/attendance/${id}`, resolver);
    return data.attendance;
  } catch (error) {
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

const createAttendance = async (newAttendance) => {
  try {
    setLoading(true);
    const { data } = await axios.post(`${URL}/attendance`, newAttendance, mutation);
    setAttendance([...attendance, data.attendance]);
    toast.success(data.message);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to create attendance");
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

const updateAttendance = async (id, updatedAttendance) => {
  try {
    setLoading(true);
    const { data } = await axios.patch(`${URL}/attendance/${id}`, updatedAttendance, mutation);
    const updatedList = [...attendance];
    const index = updatedList.findIndex(item => item._id === data.updatedAttendance._id);
    updatedList[index] = data.updatedAttendance;
    setAttendance(updatedList);
    toast.success(data.message);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to update attendance");
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

const deleteAttendance = async (id) => {
  try {
    setLoading(true);
    const { data } = await axios.delete(`${URL}/attendance/${id}`, mutation);
    setAttendance(attendance.filter(item => item._id !== data.deletedAttendance._id));
    toast.success(data.message);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to delete attendance");
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};
const getAttendanceByDateAndShift = async (date, shift) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/attendance/search?date=${date}&shift=${shift}`, resolver);
    return data; // ✅ FIXED: backend returns records array directly
  } catch (error) {
    console.error("Fetch error:", error.message);
    return [];
  } finally {
    setLoading(false);
  }
};



  // Feed Management
  const getFeeds = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/feed`, resolver);
      setFeed(data.feeds);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFeedById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/feed/${id}`, resolver);
      return data.feed;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createFeed = async (newFeed) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${URL}/feed`, newFeed, mutation);
      setFeed([...feed, data.feed]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeed = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${URL}/feed/${id}`, mutation);
      setFeed(feed.filter((item) => item._id !== data.deletedFeed._id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFeed = async (id, newFeed) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${URL}/feed/${id}`,
        newFeed,
        mutation
      );
      const spread = [...feed];
      const index = spread.findIndex(
        (item) => item._id === data.updatedFeed._id
      );
      spread[index] = data.updatedFeed;
      setFeed(spread);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Feed Consumption
  // Feed Consumption State
// Feed Consumption - GET all
const getFeedConsumptions = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/feedconsume`, resolver);
    setFeedConsumptions(data);
    return data;
  } catch (error) {
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

// Feed Consumption - GET by ID
const getFeedConsumptionById = async (id) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/feedconsume/${id}`, resolver);
    return data.feedConsumption;
  } catch (error) {
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

// Feed Consumption - CREATE
const createFeedConsumption = async (payload) => {
  try {
    setLoading(true);
    const { data } = await axios.post(`${URL}/feedconsume`, payload, mutation);
    setFeedConsumption([...feedConsumption, data.feedConsumption]);
    toast.success(data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create feed consumption");
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

// Feed Consumption - UPDATE
const updateFeedConsumption = async (id, payload) => {
  try {
    setLoading(true);
    const { data } = await axios.patch(`${URL}/feedconsume/${id}`, payload, mutation);
    const updatedList = [...feedConsumption];
    const index = updatedList.findIndex((item) => item._id === id);
    updatedList[index] = data.feedConsumption;
    setFeedConsumption(updatedList);
    toast.success(data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update feed consumption");
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};

// Feed Consumption - DELETE
const deleteFeedConsumption = async (id) => {
  try {
    setLoading(true);
    const { data } = await axios.delete(`${URL}/feedconsume/${id}`, mutation);
    setFeedConsumption(feedConsumption.filter((item) => item._id !== id));
    toast.success(data.message);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete feed consumption");
    console.log(error.message);
  } finally {
    setLoading(false);
  }
};
const getBatches = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/batch`, resolver);
    setBatches(data);
  } catch (error) {
    console.error(error.message);
  } finally {
    setLoading(false);
  }
};

const getPoultryRecords = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/poultryrecord`, resolver);
    setPoultryRecords(data);
  } catch (error) {
    console.error(error.message);
  } finally {
    setLoading(false);
  }
};


const getBatchById = async (id) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${URL}/batch/${id}`, resolver);
    return data;
  } catch (error) {
    console.error(error.message);
    toast.error("Failed to fetch batch details");
  } finally {
    setLoading(false);
  }
};

const createBatch = async (batch) => {
  try {
    setLoading(true);
    const { data } = await axios.post(`${URL}/batch`, batch, mutation);
    setBatches((prev) => [...prev, data]);
    toast.success("Batch created successfully");
  } catch (error) {
    console.error(error.message);
    toast.error(error.response?.data?.message || "Failed to create batch");
  } finally {
    setLoading(false);
  }
};

const updateBatch = async (id, batch) => {
  try {
    setLoading(true);
    const { data } = await axios.patch(`${URL}/batch/${id}`, batch, mutation);
    const updatedList = [...batches];
    const index = updatedList.findIndex((item) => item._id === data._id);
    updatedList[index] = data;
    setBatches(updatedList);
    toast.success("Batch updated successfully");
  } catch (error) {
    console.error(error.message);
    toast.error(error.response?.data?.message || "Failed to update batch");
  } finally {
    setLoading(false);
  }
};

const deleteBatch = async (id) => {
  try {
    setLoading(true);
    const { data } = await axios.delete(`${URL}/batch/${id}`, mutation);
    setBatches((prev) => prev.filter((item) => item._id !== id));
    toast.success("Batch deleted successfully");
  } catch (error) {
    console.error(error.message);
    toast.error(error.response?.data?.message || "Failed to delete batch");
  } finally {
    setLoading(false);
  }
};

  // Production Management
  const getProductions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/production`, resolver);
      setProductions(data.productions);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductionById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/production/${id}`, resolver);
      return data.production;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduction = async (production) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${URL}/production`,
        production,
        mutation
      );
      setProductions([...productions, data.production]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduction = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${URL}/production/${id}`, mutation);
      setProductions(
        productions.filter((item) => item._id !== data.deletedProduction._id)
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduction = async (id, production) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${URL}/production/${id}`,
        production,
        mutation
      );
      const spread = [...productions];
      const index = spread.findIndex(
        (item) => item._id === data.updatedProduction._id
      );
      spread[index] = data.updatedProduction;
      setProductions(spread);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Payroll Management
  const getPayrolls = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/payroll`, resolver);
      setPayrolls(data.payrolls);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPayrollById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URL}/payroll/${id}`, resolver);
      return data.payroll;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPayroll = async (payroll) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${URL}/payroll`, payroll, mutation);
      setPayrolls([...payrolls, data.payroll]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePayroll = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${URL}/payroll/${id}`, mutation);
      setPayrolls(
        payrolls.filter((item) => item._id !== data.deletedPayroll._id)
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePayroll = async (id, payroll) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${URL}/payroll/${id}`,
        payroll,
        mutation
      );
      const spread = [...payrolls];
      const index = spread.findIndex(
        (item) => item._id === data.updatedPayroll._id
      );
      spread[index] = data.updatedPayroll;
      setPayrolls(spread);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const createPoultryRecord = async (record) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${URL}/poultryrecord`, record, mutation);
      setPoultryRecords([...poultryRecords, data.poultryRecord]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create poultry record");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePoultryRecord = async (id, record) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(`${URL}/poultryrecord/${id}`, record, mutation);
      const updatedList = [...poultryRecords];
      const index = updatedList.findIndex((item) => item._id === id);
      updatedList[index] = data.poultryRecord;
      setPoultryRecords(updatedList);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update poultry record");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePoultryRecord = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`${URL}/poultryrecord/${id}`, mutation);
      setPoultryRecords(poultryRecords.filter((item) => item._id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete poultry record");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeeds();
    getWorkers();
    getPayrolls();
    getInsights();
    getProductions();
    getBatches();
    getAttendance();
    
  }, []);

  return (
    <ServiceContext.Provider
      value={{
        insights,
        workers,
        feed,
        productions,
        payrolls,
        loggedInUser,
        loading,
        feedConsumptions,
        poultryRecords,
        getPoultryRecords,
        createPoultryRecord,
        updatePoultryRecord,
        deletePoultryRecord,
        formatDate,
        register,
        signIn,
        logout,
        updatePassword,
        getInsights,
        getWorkers,
        getWorkerById,
        createWorker,
        updateWorker,
        deleteWorker,
        attendance,
        getAttendance,
        getAttendanceById,
        createAttendance,
        updateAttendance,
        deleteAttendance,
        getAttendanceByDateAndShift,   
        getFeeds,
        getFeedById,
        createFeed,
        updateFeed,
        deleteFeed,
        getFeedConsumptions,
        getFeedConsumptionById,
        createFeedConsumption,
        updateFeedConsumption,
        deleteFeedConsumption,
        batches,
        getBatches,
        getBatchById,
        createBatch,
        updateBatch,
        deleteBatch,
        getProductions,
        getProductionById,
        createProduction,
        updateProduction,
        deleteProduction,
        getPayrolls,
        getPayrollById,
        createPayroll,
        updatePayroll,
        deletePayroll,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useService must be used within a ServiceProvider");
  }
  return context;
};

export { useService, ServiceProvider };
