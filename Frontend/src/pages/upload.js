import React, { useState, useEffect } from "react";
import VideoFile from "../../public/5607.mp4"; // Import the video file

const UploadPage = () => {
  const mockTranscribedText = "This is a sample transcribed text.";
  const [transcribedText, setTranscribedText] = useState(mockTranscribedText);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState(""); // Added state for notification type

  const handleDevelopmentModal = () => {
    setIsDevelopmentModalOpen(true);
  };

  const closeDevelopmentModal = () => {
    setIsDevelopmentModalOpen(false);
  };

  const handleClear = () => {
    setTranscribedText("");
    setFileName("");
  };

  const handleExtract = () => {
    setIsLoading(true);

    setTimeout(() => {
      setTranscribedText(
        "Our aim is to create a tool that makes video content more accessible and useful for a wide range of users. So try SwiftScribe today and experience the time-saving benefits for yourself."
      );
      setIsLoading(false);
    }, 3000);
  };

  const handleSave = async () => {
    if (fileName === "") {
      setNotificationMessage("Please enter a file name.");
      setNotificationType("error");
      setIsNotificationOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileName,
          content: transcribedText,
          length: transcribedText.split(" ").length,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotificationMessage("File saved successfully.");
      setNotificationType("success");
      setIsNotificationOpen(true);
    } catch (error) {
      console.error("Error while saving:", error);
      setNotificationMessage("Failed to save file.");
      setNotificationType("error");
      setIsNotificationOpen(true);
    }
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div className="upload-page px-8 bg-gray-100">
      <h1 className="text-4xl font-bold py-8">Upload Media</h1>

      <div className="video-upload-container flex items-center justify-center mx-auto">
        <div className="video-container w-7/10 bg-gray-900 rounded-l-lg overflow-hidden">
          <video
            src={VideoFile}
            controls
            className="w-full h-96 py-8 pl-8 pr-4"
          ></video>
        </div>
        <div className="panel-container w-3/10">
          <div className="panel bg-gray-700 p-4 h-96 flex flex-col justify-center items-center rounded-r-lg">
            <div className="w-full mb-8">
              <button
                className={`w-full px-4 py-2 ${
                  isLoading ? "bg-gray-500" : "bg-green-500"
                } text-white rounded-lg`}
                disabled={isLoading}
              >
                {isLoading ? "In Progress" : "Completed"}
              </button>
            </div>

            <div className="w-full">
              <button
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                disabled={isLoading}
                onClick={handleDevelopmentModal}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-transcription-container bg-gray-700 mt-8 mb-8 p-4 rounded-lg">
        <input
          type="text"
          className="w-full p-2 border border-black rounded-md mb-4"
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <textarea
          className="w-full h-48 p-2 border border-black rounded-md mb-4"
          placeholder="Transcribed Text"
          value={transcribedText}
          onChange={(e) => setTranscribedText(e.target.value)}
        ></textarea>
        <div className="flex justify-center gap-8">
          <button
            className="px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg mr-2"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className={`px-8 py-2 ${
              isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-lg`}
            onClick={handleExtract}
            disabled={isLoading}
          >
            {isLoading ? "In Progress" : "Extract"}
          </button>
          <button
            className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      {isNotificationOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-gray-700 rounded-lg p-8" 
          >
            <h3 className={`text-lg ${
              notificationType === "error" ? "text-red-500" : "text-green-500"
            } mb-4`}>{notificationMessage}</h3>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={closeNotification}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isDevelopmentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg p-8">
            <h3 className="text-lg text-white mb-4">This feature is under development</h3>
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

export default UploadPage;
