import React, { useState, useEffect } from "react";
import StatisticsContainer from "../components/files/StatisticsContainer";
import FileContainer from "../components/files/FileContainer";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [storageCount, setStorageCount] = useState(0);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("/api/files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
          }),
        });
        const data = await response.json();
        setLogs(data.files);
        setFileCount(data.files.length);
        setStorageCount(data.totalStorage);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const deleteFile = async (fileId) => {
    try {
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

  return (
    <main className="h-screen">
      <h1 className="text-4xl font-bold p-8">My Dashboard</h1>
      <div className="flex justify-between pl-8 pr-12">
        <StatisticsContainer title="Files in Database" value={fileCount.toString()} />
        <StatisticsContainer title="Total Storage Used (MB)" value={(fileCount * 0.02).toFixed(2)} />
      </div>
      {isLoading ? (
        <div className="p-16 flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="bg-white p-8">
          <FileContainer logs={logs} onDelete={deleteFile} />
        </div>
      )}
    </main>
  );
}

export default Dashboard;