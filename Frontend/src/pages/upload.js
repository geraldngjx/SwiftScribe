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
  const [transcriptionInProgress, setTranscriptionInProgress] = useState(false);
  const [summarizationActive, setSummarizationActive] = useState(true);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const fileInputRef = useRef(null);
  const [videoSource, setVideoSource] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (isNotificationOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isNotificationOpen]);

  const handleClear = () => {
    setTranscribedText("");
    setFileName("");
  };

  const handleExtract = async () => {
    setShowLanguageSelection(true);
  };

  const handleLanguageSelection = async () => {
    setShowLanguageSelection(false);

    if (selectedLanguage === "") {
      setNotificationMessage("Please select a language.");
      setNotificationType("error");
      setIsNotificationOpen(true);
      return;
    }

    setIsLoading(true);
    setTranscriptionInProgress(true);
    setIsNotificationOpen(true);
    setNotificationMessage(
      "Transcription and Summarization in progress. Please do not leave this page."
    );
    setNotificationType("info");

    if (summarizationActive) {
      await handleSummarization();
    } else {
      await handleTranscriptionOnly();
    }

    setIsLoading(false);
  };

  const handleSummarization = async () => {
    try {
      const formData = new FormData();
      formData.append("video", fileInputRef.current.files[0]);
      formData.append("language", selectedLanguage); // Add language field

      const response = await fetch(
        "https://c83a-101-78-125-97.ngrok-free.app/media/extract",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        console.log("RESPONSE STATUS: " + response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        console.log(data);

        if (data.summary === "") {
          setNotificationMessage("Transcription and Summarization Completed Successfully.");
          setTranscribedText(data.transcript);
        } else {
          setNotificationMessage("Transcription and Summarization Completed Successfully.");
          setTranscribedText(data.summary);
        }
      }
    } catch (error) {
      console.error("Error while uploading and extracting audio:", error);
      setNotificationMessage("Failed to extract audio.");
      setNotificationType("error");
    }
  };

  const handleTranscriptionOnly = async () => {
    try {
      const formData = new FormData();
      formData.append("video", fileInputRef.current.files[0]);
      formData.append("language", selectedLanguage);
  
      const response = await fetch(
        "https://c83a-101-78-125-97.ngrok-free.app/media/transcription",
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!response.ok) {
        console.log("RESPONSE STATUS: " + response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        console.log(data);
        setNotificationMessage("Transcription Completed Successfully.");
        setTranscribedText(data.transcript);
      }
    } catch (error) {
      console.error("Error while uploading and extracting audio:", error);
      setNotificationMessage("Failed to extract audio.");
      setNotificationType("error");
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
    fileInputRef.current.click();
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

  const handleLanguageSelectionClose = () => {
    setShowLanguageSelection(false);
  };

  const isProcessButtonDisabled = !fileInputRef.current || !fileInputRef.current.files || fileInputRef.current.files.length === 0;

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
        <div className="panel-container w-3/10 w-48">
          <div className="panel bg-gray-700 p-4 h-96 flex flex-col gap-4 justify-center items-center rounded-r-lg">
            <div className="w-full">
              <button
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                disabled={isLoading}
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
            <div className="w-full">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={summarizationActive}
                  onChange={() => setSummarizationActive(!summarizationActive)}
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline```jsx
-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-white dark:text-gray-300">
                  {summarizationActive ? "Summary" : "Full Transcript"}
                </span>
              </label>
            </div>
            <div className="w-full flex justify-center">
              <button
                className={`w-full px-8 py-2 ${
                  isLoading || isProcessButtonDisabled ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
                } text-white rounded-lg`}
                onClick={handleExtract}
                disabled={isLoading || isProcessButtonDisabled}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin py-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"
                      viewBox="0 0 24 24"
                    ></svg>
                  </div>
                ) : (
                  "Process"
                )}
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
            className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      {isNotificationOpen && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 ${isNotificationOpen ? 'overflow-hidden' : ''}`}>
          <div className="bg-gray-700 rounded-lg p-8 flex flex-col items-center max-w-2xl mx-auto shadow-lg border border-gray-500">
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
      {showLanguageSelection && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 ${showLanguageSelection ? 'overflow-hidden' : ''}`}>
          <div className="bg-gray-700 rounded-lg p-12 flex flex-col items-center max-w-2xl mx-auto shadow-lg border border-gray-500">
            <h3 className="text-lg text-white mb-8 text-center">Select Language</h3>
            <select
              className="w-full p-2 border border-black rounded-md mb-8"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="">Select a language</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              {/* Add more language options here */}
            </select>
            <div className="flex justify-center gap-8 mb-2">
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                onClick={handleLanguageSelectionClose}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleLanguageSelection}
              >
                Select
              </button>
            </div>
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