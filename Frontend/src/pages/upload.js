import React, { useState, useEffect } from "react";
import VideoFile from "../../public/5607.mp4"; // Import the video file

const UploadPage = () => {
  const mockTranscribedText = "This is a sample transcribed text.";
  const [transcribedText, setTranscribedText] = useState(mockTranscribedText);
  const [fileName, setFileName] = useState("");
  const [jobID, setJobID] = useState(null);

  const handleClear = () => {
    setTranscribedText("");
    setFileName("");
  };

  const handleExtract = async () => {
    try {
      const videoFilePath = "../../../public/5607.mp4"; //this is from extract.js perspective
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoFilePath: videoFilePath }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { jobID } = await response.json();
      console.log(jobID + " This is the jobID");

      setJobID(jobID);
    } catch (error) {
      console.log(jobID);
      console.error(
        "Sorry, we are unable to transcribe your video at the moment:",
        error
      );
    }
  };

  useEffect(() => {
    if (!jobID) return;

    const eventSource = new EventSource(`/api/extract?id=${jobID}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.transcribedText) {
        setTranscribedText(data.transcribedText);
        console.log(data.transcribedText);
      }
    };
    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
    };

    return () => {
      eventSource.close();
    };
  }, [jobID]);

  const handleSave = () => {
    // Logic to save the transcribed text with the specified file name
  };

  return (
    <div className="upload-page h-screen px-8 bg-gray-100">
      <h1 className="text-4xl font-bold py-8">Upload Media</h1>

      <div className="video-upload-container flex items-center justify-center mx-auto">
        <div className="video-container w-7/10 bg-gray-300 rounded-l-lg overflow-hidden">
          <video
            src={VideoFile}
            controls
            className="w-full h-96 py-8 pl-8 pr-4"
          ></video>
        </div>
        <div className="panel-container w-3/10">
          <div className="panel bg-gray-300 p-4 h-96 flex flex-col justify-center items-center rounded-r-lg">
            <div className="w-full mb-8">
              <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                Completed
              </button>
            </div>
            <div className="w-full">
              <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                Load
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-transcription-container bg-gray-300 mt-8 p-4 rounded-lg">
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
            className="px-8 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg mr-2"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg mr-2"
            onClick={handleExtract}
          >
            Extract
          </button>
          <button
            className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
