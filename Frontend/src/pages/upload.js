import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const UploadPage = () => {
  const mockTranscribedText = "This is a sample transcribed text.";
  const [transcribedText, setTranscribedText] = useState(mockTranscribedText);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [transcriptionInProgress, setTranscriptionInProgress] = useState(false); // New state
  const fileInputRef = useRef(null);
  const [videoSource, setVideoSource] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (isNotificationOpen) {
      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Enable scrolling
      document.body.style.overflow = "auto";
    }
  
    // Clean up the effect
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isNotificationOpen]);

  const handleClear = () => {
    setTranscribedText("");
    setFileName("");
  };

  const handleExtract = async () => {
    setIsLoading(true);
    setTranscriptionInProgress(true); // Start transcription
    setIsNotificationOpen(true);
    setNotificationMessage("Transcription and Summarization in progress. Please do not leave this page.");
    setNotificationType("info");

    try {
      const formData = new FormData();
      formData.append("video", fileInputRef.current.files[0]);

      const response = await fetch("https://fd25-119-74-197-129.ngrok-free.app/media/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.summary === "") {
        setNotificationMessage("Transcription and Summarisation Completed Successfully.")
        setTranscribedText(data.transcript);
      } else {
        setNotificationMessage("Transcription and Summarisation Completed Successfully.")
        setTranscribedText(data.summary);
      }
    } catch (error) {
      console.error("Error while uploading and extracting audio:", error);
      setNotificationMessage("Failed to extract audio.");
      setNotificationType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (fileName === "") {
      setNotificationMessage("Please enter a file name.");
      setNotificationType("error");
      setIsNotificationOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
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

  const handleUpload = () => {
    fileInputRef.current.click(); // Trigger the file selection dialog
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
      setFileName(file.name);

      const videoURL = URL.createObjectURL(file);
      setVideoSource(videoURL);
    }
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <div className="upload-page px-8">
      <h1 className="text-4xl font-bold py-8">Upload Media</h1>

      <div className="video-upload-container flex items-center justify-center mx-auto">
        <div className="video-container w-7/10 bg-gray-900 rounded-l-lg overflow-hidden">
          <video
            src={videoSource}
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
                onClick={handleUpload}
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
            className="px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
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
            {isLoading ? (
              <>                
              <svg
                  className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"
                  viewBox="0 0 24 24"
                ></svg>
              </>
            ) : (
              "Extract"
            )}
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
        <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 ${isNotificationOpen ? 'overflow-hidden' : ''}`}>
          <div className="bg-gray-700 rounded-lg p-8 flex flex-col items-center max-w-2xl mx-auto">
            <p className="text-sm text-gray-400 mb-2 text-center">SwiftScribe is still currently in its beta testing stage, utilizing a localized server for cost constraints. We recommend using shorter videos within 1 minute for optimal performance due to speed constraints.</p>
            <h3 className={`text-lg ${notificationType === "error" ? "text-red-500" : "text-green-500"} mb-4 text-center`}>{notificationMessage}</h3>
            {isLoading ? (
              <div className="flex items-center justify-center my-4">
                <svg
                  className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"
                  viewBox="0 0 24 24"
                ></svg>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={closeNotification}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default UploadPage;
