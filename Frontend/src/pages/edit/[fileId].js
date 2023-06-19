import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

const EditPage = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success"); // Added modalType state
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
    // Route user back to '/manage' page after closing the modal
    router.push("/manage");
  };

  const handleBack = () => {
    // Route user back to '/manage' page
    router.push("/manage");
  };

  return (
    <div className="edit-page h-screen px-8 bg-gray-100">
      <h1 className="text-4xl font-bold py-8">Edit Document</h1>

      <div className="text-transcription-container bg-gray-700 mb-8 p-4 rounded-lg">
        <input
          type="text"
          className="w-full p-2 border border-black rounded-md mb-4"
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <textarea
          className="w-full h-72 p-2 border border-black rounded-md mb-4"
          placeholder="Transcribed Text"
          value={transcribedText}
          onChange={(e) => setTranscribedText(e.target.value)}
        ></textarea>
        <div className="flex justify-center">
          <button
            className="px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg mr-4"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {isModalOpen && (
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