import React, { useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
} from "chart.js";
import { FaEgg, FaUserTie, FaMoneyBillWave } from "react-icons/fa";
import { useService } from "../../context";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler
);

const Home = () => {
  const { insights, getInsights } = useService();

  const reports = [
    {
      title: "Total Workers",
      value: insights.totalWorkers,
      bgColor: "bg-yellow-500",
      icon: <FaUserTie size={20} />,
    },
    {
      title: "Daily Eggs Production",
      value: insights.totalEggs,
      bgColor: "bg-blue-500",
      icon: <FaEgg size={20} />,
    },
    {
      title: "Total Expenses",
      value: `Rs ${insights.totalExpenses}`,
      bgColor: "bg-red-500",
      icon: <FaMoneyBillWave size={20} />,
    },
  ];

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const productionData = labels.map(
    (day) =>
      insights?.weeklyEggProduction?.find((item) => item.day === day)
        ?.totalEggs || 0
  );

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Egg Production",
        data: productionData,
        borderColor: "#FFA500",
        backgroundColor: "rgba(255, 165, 0, 0.4)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Feed", "Salaries", "Maintenance", "Other"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#FFD700", "#FF8C00", "#32CD32", "#FF4500"],
      },
    ],
  };

  useEffect(() => {
    getInsights();
  }, []);

  return (
    <section className="p-3 space-y-6">
      {/* Reports Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center h-32 ${report.bgColor} text-white rounded-lg shadow-lg p-6 space-y-2`}
          >
            <p>{report.icon}</p>
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="text-2xl font-bold">{report.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-center mb-4">
            Expense Distribution
          </h3>
          <div className="w-72 h-72">
            <Doughnut data={doughnutData} />
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-center mb-4">
            Weekly Egg Production Trend
          </h3>
          <div className="w-full pt-16">
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
