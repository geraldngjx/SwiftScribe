import React, { useState, useEffect } from "react";
import StatisticsContainer from "../components/files/StatisticsContainer";
import FileContainer from "../components/files/FileContainer";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files");
        const data = await response.json();
        setLogs(data.files);
        setFileCount(data.files.length);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const deleteFile = async (fileId) => {
    try {
      console.log(fileId);
      await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: fileId,
        }),
      });
      setLogs((prevLogs) => prevLogs.filter((log) => log._id !== fileId));
      setFileCount((prevCount) => prevCount - 1); // Update the file count after deleting a file
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  console.log("logs:", logs);

  return (
    <main className="h-screen pl-8 pr-12 bg-white">
      <h1 className="text-4xl font-bold py-8">My Dashboard</h1>
      <div className="flex justify-between mb-8">
        <StatisticsContainer title="Documents Summarised" value={fileCount.toString()} />
        <StatisticsContainer title="Total Storage Used (GB)" value="Under Development" />
      </div>
      <FileContainer logs={logs} onDelete={deleteFile} />
    </main>
  );
}

export default Dashboard;