import React, { useState } from "react";

const FileRow = ({ log, onDelete }) => {
  const { name, length, date, _id } = log;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false);

  const handleDevelopmentModal = () => {
    setIsDevelopmentModalOpen(true);
  };

  const closeDevelopmentModal = () => {
    setIsDevelopmentModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(false);
    onDelete(_id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="file-row flex items-center justify-between bg-[#3b3b67] p-2 rounded-lg my-4">
      <div className="w-1/4">
        <h4 className="text-xs text-gray-300 mb-1 pl-2">Name</h4>
        <div className="text-white pl-2">{name}</div>
      </div>
      <div className="w-1/4">
        <h4 className="text-xs text-gray-300 mb-1">Length</h4>
        <div className="text-white">{length}</div>
      </div>
      <div className="w-1/4">
        <h4 className="text-xs text-gray-300 mb-1">Last Edited</h4>
        <div className="text-white">{formatDate(date)}</div>
      </div>
      <div className="w-1/8">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleDevelopmentModal}
        >
          Open
        </button>
      </div>
      <div className="w-1/8 pr-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={handleOpenModal}
        >
          Delete
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-lg mb-4">
              Are you sure you want to delete this file?
            </h3>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isDevelopmentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-lg mb-4">This feature is under development</h3>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={closeDevelopmentModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileRow;
