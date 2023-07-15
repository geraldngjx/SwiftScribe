import React, { useState, useEffect } from "react";
import StatisticsContainer from "../components/files/StatisticsContainer";
import FileContainer from "../components/files/FileContainer";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const { user } = useAuth();

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
        console.log("DATA: " + data);
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
    <main className="h-screen">
      <h1 className="text-4xl font-bold p-8">My Dashboard</h1>
      <div className="flex justify-between pl-8 pr-12">
        <StatisticsContainer title="Files in Database" value={fileCount.toString()} />
        <StatisticsContainer title="Total Media Transcribed" value={user.media_transcribed} />
      </div>
      <div className="bg-white p-8">
        <FileContainer logs={logs} onDelete={deleteFile} />
      </div>
    </main>
  );
}

export default Dashboard;