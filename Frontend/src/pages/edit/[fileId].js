import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { jsPDF } from "jspdf";

const EditPage = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [isHighContrast, setIsHighContrast] = useState(false); // New state for High Contrast mode
  const { user } = useAuth();
  const router = useRouter();
  const { fileId } = router.query;

  useEffect(() => {
    // Fetch the file from the database based on the fileId
    const fetchFile = async () => {
      try {
        const response = await fetch(`/api/files?fileId=${fileId}`);
        const data = await response.json();
        setFile(data.file);
        setFileName(data.file.name);
        setTranscribedText(data.file.content);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [fileId]);

  const handleSave = async () => {
    try {
      await fetch("/api/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: fileId,
          name: fileName,
          content: transcribedText,
        }),
      });

      // Show success modal
      setModalType("success");
      setModalMessage("File saved successfully");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error while updating file:", error);
      // Show error modal
      setModalType("error");
      setModalMessage("Failed to save file");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Route user back to 'View Document' page of the specific file
    router.push(`/manage`);
  };

  const handleBack = () => {
    // Route user back to 'View Document' page of the specific file
    router.push(`/manage`);
  };

  const closeOptions = () => {
    setIsOptionsOpen(false);
  };

  const handleExport = () => {
    if (selectedFormat === "pdf") {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        lineHeight: 1,
        compress: true,
      });
  
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let cursorY = margin;
  
      // Set background and foreground colors for high contrast mode
      const backgroundColor = isHighContrast ? "#000000" : "#ffffff";
      const foregroundColor = isHighContrast ? "#ffffff" : "#000000";
  
      doc.setFillColor(backgroundColor);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
  
      doc.setFontSize(20);
      doc.setTextColor(foregroundColor);
  
      // Wrap the title text within the A4 size
      const titleLines = doc.splitTextToSize(fileName, pageWidth - margin * 2);
      const titleHeight = titleLines.length * 20; // Calculate the height of the title after wrapping
  
      if (cursorY + titleHeight > pageHeight - margin) {
        // If the title wraps and exceeds the page height, adjust cursorY
        cursorY = margin;
      }
  
      titleLines.forEach((line) => {
        doc.text(line, margin, cursorY);
        cursorY += 20; // Increase Y position for the next line
      });
  
      doc.setFontSize(12);
      doc.setTextColor(foregroundColor);
  
      const lines = doc.splitTextToSize(transcribedText, pageWidth - margin * 2);
  
      lines.forEach((line) => {
        if (cursorY + 12 > pageHeight - margin) {
          doc.addPage();
          doc.setFillColor(backgroundColor);
          doc.rect(0, 0, pageWidth, pageHeight, "F");
          cursorY = margin;
        }
  
        doc.text(line, margin, cursorY);
        cursorY += 12;
      });
  
      doc.save(`${fileName}.pdf`);
    } else if (selectedFormat === "text") {
      const element = document.createElement("a");
      const file = new Blob([transcribedText], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${fileName}.txt`;
      document.body.appendChild(element); // Required for Firefox
      element.click();
    }
  };

  return (
    <div className={`edit-page h-screen px-8 ${isHighContrast ? "high-contrast" : ""}`}>
      <h1 className="text-4xl font-bold py-8">Edit Document</h1>

      <div className={`text-transcription-container bg-gray-700 mb-8 p-4 rounded-lg ${isHighContrast ? "text-white" : ""}`}>
        <input
          type="text"
          className={`w-full p-2 border border-black rounded-md mb-4 ${isHighContrast ? "bg-black text-white" : ""}`}
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <textarea
          className={`w-full h-72 p-2 border border-black rounded-md mb-4 ${isHighContrast ? "bg-black text-white" : ""}`}
          placeholder="Transcribed Text"
          value={transcribedText}
          onChange={(e) => setTranscribedText(e.target.value)}
        ></textarea>
        <div className="w-full flex justify-end items-center"> {/* Updated container for buttons */}
          <div className="w-1/2 flex items-end">
            <button
              className={`px-8 py-2 ${isHighContrast ? "bg-white text-black" : "bg-red-500 hover:bg-red-600 text-white"} rounded-lg mr-4`}
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className={`px-8 py-2 ${isHighContrast ? "bg-white text-black" : "bg-blue-500 hover:bg-blue-600 text-white"} rounded-lg mr-4`}
              onClick={() => setIsOptionsOpen(true)}
            >
              Export
            </button>
            <button
              className={`px-8 py-2 ${isHighContrast ? "bg-white text-black" : "bg-green-500 hover:bg-green-600 text-white"} rounded-lg`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
          <label className="relative inline-flex items-center cursor-pointer"> {/* High Contrast Mode Toggle Button */}
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isHighContrast}
              onChange={() => setIsHighContrast(!isHighContrast)}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-white dark:text-gray-300">
              {isHighContrast ? "High Contrast" : "Normal View"}
            </span>
          </label>
        </div>
      </div>

      {isOptionsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg p-8">
            <h3 className={`text-lg text-white text-center mb-4 ${isHighContrast ? "high-contrast-text" : ""}`}>
              Export As
            </h3>
            <select
              className={`w-full p-2 mb-4 bg-gray-500 text-white rounded-lg ${
                isHighContrast ? "high-contrast-select" : ""
              }`}
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="">Select Format</option>
              <option value="pdf">PDF</option>
              <option value="text">Text File</option>
            </select>
            <div className="flex justify-between">
              <button
                className={`px-8 py-2 ${
                  isHighContrast ? "bg-white text-black" : "bg-gray-500 hover:bg-gray-600 text-white"
                } rounded-lg mr-4`}
                onClick={closeOptions}
              >
                Close
              </button>
              <button
                className={`px-8 py-2 ${
                  isHighContrast ? "bg-white text-black" : "bg-blue-500 hover:bg-blue-600 text-white"
                } rounded-lg ${
                  selectedFormat ? "" : "bg-gray-600 hover:bg-gray-600 text-gray-500 curser-not-allowed"
                }`}
                onClick={handleExport}
                disabled={!selectedFormat}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {modalMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-lg p-8">
            <h3
              className={`text-lg ${
                modalType === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {modalMessage}
            </h3>
            <div className="flex justify-center mt-8">
              <button
                className={`px-4 py-2 ${
                  modalType === "error" ? "bg-red-500" : "bg-blue-500"
                } text-white rounded-lg mr-4`}
                onClick={closeModal}
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

export default EditPage;