import React, { useState, useEffect } from "react";
import FileContainer from "../components/files/FileContainer";
import { useAuth } from "../context/AuthContext";

const FileManagementPage = () => {
  const [logs, setLogs] = useState([]);
  const [fileCount, setFileCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false); // Set loading to false once files are received
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
    <main className="h-screen">
      <h1 className="text-4xl font-bold p-8">File Management</h1>
      <div className="px-8">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-700 rounded-md"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="bg-white p-8 h-[calc(100vh-150px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center">
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
          <FileContainer logs={filteredLogs} onDelete={deleteFile} />
        )}
      </div>
    </main>
  );
};

export default FileManagementPage;