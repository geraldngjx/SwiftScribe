import React, { useState, useEffect } from "react";
import FileContainer from "../components/files/FileContainer";
import { useAuth } from "../context/AuthContext";

const FileManagementPage = () => {
  const [logs, setLogs] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
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
        setLogs(data.files);
        setFileCount(data.files.length);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [user.uid]);

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredLogs = logs.filter((log) =>
    log.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="h-screen bg-white">
      <h1 className="text-4xl font-bold p-8">File Management</h1>
      <div className="px-8">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="bg-white p-8 h-[calc(100vh-150px)] overflow-y-auto">
        <FileContainer logs={filteredLogs} onDelete={deleteFile} />
      </div>
    </main>
  );
};

export default FileManagementPage;