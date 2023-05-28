import React, { useState, useEffect } from "react";
import StatisticsContainer from "../components/files/StatisticsContainer";
import FileContainer from "../components/files/FileContainer";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files");
        const data = await response.json();
        setLogs(data.files);
        setFileCount(data.files.length);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after data is fetched (or in case of error)
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
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <>
          <div className="flex justify-between mb-8">
            <StatisticsContainer title="Documents Summarised" value={fileCount.toString()} />
            <StatisticsContainer title="Total Storage Used (GB)" value="Under Development" />
          </div>
          <FileContainer logs={logs} onDelete={deleteFile} />
        </>
      )}
    </main>
  );
}

export default Dashboard;