import React, { useState, useEffect } from "react";
import { useService } from "../../context";

const Reports = () => {
  const {
    feed,
    feedConsumptions,
    productions,
    payrolls,
    getFeeds,
    getFeedConsumptions,
    getProductions,
    getPayrolls,
  } = useService();

  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);

  // Lazy load data based on selected report type
  useEffect(() => {
    if (!reportType) return;

    const fetchData = async () => {
      if (reportType === "feed" && feed.length === 0) await getFeeds();
      if (reportType === "feedconsume" && feedConsumptions.length === 0)
        await getFeedConsumptions();
      if (reportType === "production" && productions.length === 0)
        await getProductions();
      if (reportType === "payroll" && payrolls.length === 0)
        await getPayrolls();
    };

    fetchData();
  }, [reportType]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleGenerate = () => {
    if (!reportType) {
      alert("Please select a report type.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const selectedData = {
      feed,
      feedconsume: feedConsumptions,
      production: productions,
      payroll: payrolls,
    };

    const data =
      selectedData[reportType]?.filter((item) => {
        const d = new Date(item.date);
        return d >= start && d <= end;
      }) || [];

    setReportData(data);
  };

  const renderTable = () => {
    if (!reportData.length)
      return <p className="mt-4">No records found for selected range.</p>;

    switch (reportType) {
      case "feed":
        return (
          <table className="table-auto w-full border mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Feed Type</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{formatDate(item.date)}</td>
                  <td className="border px-4 py-2">{item.feedType}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "feedconsume":
        return (
          <table className="table-auto w-full border mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Feed Type</th>
                <th className="border px-4 py-2">Quantity Used</th>
                <th className="border px-4 py-2">Batch</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{formatDate(item.date)}</td>
                  <td className="border px-4 py-2">{item.feedType}</td>
                  <td className="border px-4 py-2">
                    {item.quantityUsed ?? item.quantity}
                  </td>
                  <td className="border px-4 py-2">{item.batch || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "production":
        return (
          <table className="table-auto w-full border mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Total Eggs</th>
                <th className="border px-4 py-2">Good Eggs</th>
                <th className="border px-4 py-2">Damaged Eggs</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{formatDate(item.date)}</td>
                  <td className="border px-4 py-2">{item.totalEggs}</td>
                  <td className="border px-4 py-2">{item.goodEggs}</td>
                  <td className="border px-4 py-2">{item.damagedEggs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "payroll":
        return (
          <table className="table-auto w-full border mt-4">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Eggs Sold</th>
                <th className="border px-4 py-2">Price/Egg</th>
                <th className="border px-4 py-2">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => {
                const revenue = (item.eggsSold || 0) * (item.pricePerEgg || 0);
                return (
                  <tr key={index}>
                    <td className="border px-4 py-2">{formatDate(item.date)}</td>
                    <td className="border px-4 py-2">{item.eggsSold}</td>
                    <td className="border px-4 py-2">{item.pricePerEgg}</td>
                    <td className="border px-4 py-2">{revenue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => setReportType("feed")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Feed Report
        </button>
        <button onClick={() => setReportType("feedconsume")} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded">
          Feed Consumption Report
        </button>
        <button onClick={() => setReportType("production")} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
          Egg Production Report
        </button>
        <button onClick={() => setReportType("payroll")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Payroll Report
        </button>
      </div>

      {reportType && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-3 py-2 rounded"
              />
            </div>
            <div className="mt-6">
              <button
                disabled={!startDate || !endDate}
                onClick={handleGenerate}
                className={`px-6 py-2 rounded font-medium transition ${
                  !startDate || !endDate
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {renderTable()}
    </div>
  );
};

export default Reports;
