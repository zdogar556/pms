import React, { useState } from "react";
import { useService } from "../../context";
// import {
//   LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

const Reports = () => {
  const {
    getEggProductionReport,
    getFeedReport,
    getFeedConsumptionReport
  } = useService();

  const [selectedReport, setSelectedReport] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reportData, setReportData] = useState([]);

  const handleGenerate = async () => {
    if (!from || !to) return alert("Select both dates");

    let data = [];
    if (selectedReport === "egg") {
      data = await getEggProductionReport(from, to);
    } else if (selectedReport === "feed") {
      data = await getFeedReport(from, to);
    } else if (selectedReport === "feedConsumption") {
      data = await getFeedConsumptionReport(from, to);
    }

    setReportData(data);
  };

  const renderChart = () => {
    if (reportData.length === 0) return null;

    const chartData = reportData.map((r) => ({
      ...r,
      date: new Date(r.date).toLocaleDateString()
    }));

    if (selectedReport === "egg") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalEggs" fill="#8884d8" name="Total Eggs" />
            <Bar dataKey="goodEggs" fill="#82ca9d" name="Good Eggs" />
            <Bar dataKey="damagedEggs" fill="#ff6961" name="Damaged Eggs" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (selectedReport === "feed") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="quantity" stroke="#8884d8" name="Quantity" />
            <Line type="monotone" dataKey="cost" stroke="#82ca9d" name="Cost" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (selectedReport === "feedConsumption") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" name="Quantity Used" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const renderTable = () => {
    if (reportData.length === 0) return null;

    if (selectedReport === "egg") {
      return (
        <table className="w-full border mt-4">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Good</th>
              <th className="border p-2">Damaged</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((r) => (
              <tr key={r._id}>
                <td className="border p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="border p-2">{r.totalEggs}</td>
                <td className="border p-2">{r.goodEggs}</td>
                <td className="border p-2">{r.damagedEggs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === "feed") {
      return (
        <table className="w-full border mt-4">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Cost</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((r) => (
              <tr key={r._id}>
                <td className="border p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="border p-2">{r.feedType}</td>
                <td className="border p-2">{r.quantity}</td>
                <td className="border p-2">{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (selectedReport === "feedConsumption") {
      return (
        <table className="w-full border mt-4">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Quantity Used</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((r) => (
              <tr key={r._id}>
                <td className="border p-2">{new Date(r.date).toLocaleDateString()}</td>
                <td className="border p-2">{r.feedType}</td>
                <td className="border p-2">{r.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Reports</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setSelectedReport("egg")}>
          🥚 Egg Production
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setSelectedReport("feed")}>
          🐔 Feed Purchase
        </button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded" onClick={() => setSelectedReport("feedConsumption")}>
          🍽️ Feed Consumption
        </button>
      </div>

      {selectedReport && (
        <div className="flex items-center gap-2 mb-4">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border px-2 py-1" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border px-2 py-1" />
          <button onClick={handleGenerate} className="bg-black text-white px-4 py-1 rounded">
            Generate Report
          </button>
        </div>
      )}

      {/* Chart */}
      {renderChart()}

      {/* Table */}
      {renderTable()}
    </div>
  );
};

export default Reports;
