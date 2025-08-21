import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
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
    if (!reportType || !startDate || !endDate) {
      alert("Please select report type and date range.");
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

  const renderChart = () => {
    if (!reportData.length) return null;

    const chartData = reportData.map((item) => {
      const date = formatDate(item.date);
      switch (reportType) {
        case "feed":
          return { date, quantity: item.quantity };
        case "feedconsume":
          return {
            date,
            quantityUsed: item.quantityUsed ?? item.quantity,
          };
        case "production":
          return {
            date,
            goodEggs: item.goodEggs,
            damagedEggs: item.damagedEggs,
          };
        case "payroll":
          return {
            date,
            revenue: (item.eggsSold || 0) * (item.pricePerEgg || 0),
          };
        default:
          return {};
      }
    });

    return (
      <div className="w-full h-96 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          {reportType === "production" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="goodEggs" fill="#4CAF50" />
              <Bar dataKey="damagedEggs" fill="#F44336" />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={
                  reportType === "feed"
                    ? "quantity"
                    : reportType === "feedconsume"
                    ? "quantityUsed"
                    : "revenue"
                }
                stroke="#FF9800"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTable = () => {
    if (!reportData.length)
      return <p className="mt-4">No records found for selected range.</p>;

    switch (reportType) {
      case "feed":
        return (
          <table className="table-auto w-full border mt-4">
            <thead className="bg-[#2A2A40] text-white">
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
                  <td className="border px-4 py-2">{item.quantity} Kg</td>
                  <td className="border px-4 py-2">{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "feedconsume":
        return (
          <table className="table-auto w-full border mt-4">
            <thead className="bg-[#2A2A40] text-white">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Feed Type</th>
                <th className="border px-4 py-2">Quantity Used</th>
                {/* <th className="border px-4 py-2">Batch</th> */}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{formatDate(item.date)}</td>
                  <td className="border px-4 py-2">{item.feedType} </td>
                  <td className="border px-4 py-2">
                    {item.quantityUsed ?? item.quantity}Kg
                  </td>
                  {/* <td className="border px-4 py-2">{item.batch || "-"}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "production":
        return (
          <table className="table-auto w-full border mt-4">
            <thead className="bg-[#2A2A40] text-white">
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
            <thead className="bg-[#2A2A40] text-white">
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

  const reportTitles = {
    feed: "Feed Report",
    feedconsume: "Feed Consumption Report",
    production: "Egg Production Report",
    payroll: "Payroll Report",
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
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
          <div className="flex items-center gap-4 mb-4 flex-wrap">
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

      {reportData.length > 0 && (
        <h3 className="text-xl font-semibold mt-6 mb-2">
          {reportTitles[reportType]}
        </h3>
      )}

      {renderTable()}
      {renderChart()}
    </div>
  );
};

export default Reports;
