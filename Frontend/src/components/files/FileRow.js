import React from "react";

const FileRow = ({ log, handleOpen, handleDelete }) => {
  const { filename, wordCount, date } = log;

  const handleOpenClick = () => {
    // Invoke the handleOpen function passing the log or any relevant data
    handleOpen(log);
  };

  const handleDeleteClick = () => {
    // Invoke the handleDelete function passing the log or any relevant data
    handleDelete(log);
  };

  return (
    <div className="file-row flex items-center justify-between bg-[#3b3b67] p-2 rounded-lg my-4">
      <div className="w-1/4 text-white pl-4">{filename}</div>
      <div className="w-1/4 text-white">{wordCount}</div>
      <div className="w-1/4 text-white">{date}</div>
      <div className="w-1/8">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleOpenClick}
        >
          Open
        </button>
      </div>
      <div className="w-1/8 pr-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FileRow;