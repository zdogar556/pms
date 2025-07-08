import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Layout = lazy(() => import("./layouts/Index"));
const Home = lazy(() => import("./pages/home/Home"));
const Worker = lazy(() => import("./pages/worker/Worker"));
const Setting = lazy(() => import("./pages/settings/Setting"));
const Production = lazy(() => import("./pages/production/Production"));
const Payroll = lazy(() => import("./pages/payroll/Payroll"));
const Feed = lazy(() => import("./pages/feed/Feed"));
const Feedconsume = lazy(() => import("./pages/feed/feedConsume"));
const PoultryBatches = lazy(() => import("./pages/poultry-batches/poultry-batches"));
const PoultryBatchRecord = lazy(() => import("./pages/poultry-batches/poultry-batch-record"));
const Reports=lazy(()=>import("./pages/reports/Reports"));

const Loader = () => <div className="flex items-center justify-center h-screen">Loading...</div>;

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <>
      <Toaster />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {token ? (
            <Route path="/pms/*" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="workers" element={<Worker />} />
              <Route path="settings" element={<Setting />} />
              <Route path="productions" element={<Production />} />
              <Route path="payrolls" element={<Payroll />} />
              <Route path="feeds" element={<Feed />} />
              <Route path="feedconsume" element={<Feedconsume />} />
              <Route path="batch" element={<PoultryBatches />} />
              <Route path="batch/:batchId/records" element={<PoultryBatchRecord />} />
              <Route path="reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/pms/" />} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
