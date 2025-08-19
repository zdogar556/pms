import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useService } from "../../context";
import { Button } from "../../components/ui/button";

const VaccinationPage = () => {
  const { batchId } = useParams();
  const {
    vaccinations,
    loading,
    getVaccinationsByBatch,
    updateVaccination,
    generateSchedule,
    getBatchById, // ✅ to fetch batch details
  } = useService();

  const [localVaccinations, setLocalVaccinations] = useState([]);
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      // ✅ Fetch batch details
      const batchData = await getBatchById(batchId);
      setBatch(batchData);

      // ✅ Fetch vaccinations
      let data = await getVaccinationsByBatch(batchId);

      if (!data.vaccinations || data.vaccinations.length === 0) {
        const generatedData = await generateSchedule(batchId);
        data = generatedData;
      }

      setLocalVaccinations(data.vaccinations || []);
    };

    if (batchId) loadData();
  }, [batchId]);

  // Mark Completed
const markCompleted = async (id) => {
  const now = new Date();
  await updateVaccination(id, {
    status: "Completed",
    dateGiven: now,
  });

  // ✅ Update instantly in local state
  setLocalVaccinations((prev) =>
    prev.map((v) =>
      v._id === id ? { ...v, status: "Completed", dateGiven: now } : v
    )
  );
};

// Edit Vaccination
const editVaccination = async (v) => {
  const newVaccineName = prompt("Enter new vaccine name:", v.vaccineName);
  const newDay = prompt("Enter new day:", v.day);
  const newDate = prompt(
    "Enter new date (YYYY-MM-DD):",
    v.dateGiven ? new Date(v.dateGiven).toISOString().split("T")[0] : ""
  );

  if (!newVaccineName || !newDay) return;

  await updateVaccination(v._id, {
    vaccineName: newVaccineName,
    day: Number(newDay),
    dateGiven: newDate ? new Date(newDate) : v.dateGiven,
  });

  // ✅ Update instantly
  setLocalVaccinations((prev) =>
    prev.map((item) =>
      item._id === v._id
        ? {
            ...item,
            vaccineName: newVaccineName,
            day: Number(newDay),
            dateGiven: newDate ? new Date(newDate) : v.dateGiven,
          }
        : item
    )
  );
};

// Reset to Pending
const resetToPending = async (id) => {
  await updateVaccination(id, { status: "Pending", dateGiven: null });

  // ✅ Update instantly
  setLocalVaccinations((prev) =>
    prev.map((v) =>
      v._id === id ? { ...v, status: "Pending", dateGiven: null } : v
    )
  );
};


  if (loading) return <p>Loading vaccination schedule...</p>;

  const list = localVaccinations.length > 0 ? localVaccinations : vaccinations;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Vaccination Schedule</h1>
      {batch && (
        <div className="mb-4 text-gray-700">
          <p>
            <strong>Batch Name:</strong> {batch.batchName}
          </p>
          <p>
            <strong>Batch Type:</strong> {batch.type}
          </p>
        </div>
      )}

      {list.length === 0 ? (
        <p>No schedule found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-[#2A2A40] text-white">
              <th className="p-2">Vaccine</th>
              <th className="p-2">Day</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date Given</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((v) => (
              <tr key={v._id} className="border-b">
                <td className="p-2 text-center">{v.vaccineName}</td>
                <td className="p-2 text-center">Day {v.day}</td>
                <td className="p-2 text-center">{v.status}</td>
                <td className="p-2 text-center">
                  {v.dateGiven
                    ? new Date(v.dateGiven).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 text-center flex justify-center gap-2">
                  {v.status === "Pending" && (
                    <Button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => markCompleted(v._id)}
                    >
                      Mark Completed
                    </Button>
                  )}

                  <Button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => editVaccination(v)}
                  >
                    Edit
                  </Button>

                  {v.status === "Completed" && (
                    <Button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => resetToPending(v._id)}
                    >
                      Reset
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VaccinationPage;
