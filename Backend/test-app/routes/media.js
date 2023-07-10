const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');
const path = require('path');
const cors = require('cors'); // Import the cors middleware

const VIDEO_BASE_PATH = "./uploads";

const storage = multer.diskStorage({
  destination: VIDEO_BASE_PATH,
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Enable CORS
router.use(cors());

router.post("/extract", upload.single("video"), async (req, res) => {
  try {
    const language = req.body.language;

    console.log("API REQUEST RECEIVED");
    console.log("UPLOADING FILE NOW");
    console.log("LANGUAGE: " + language);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const videoFilePath = req.file.path;

    console.log("VIDEO FILE PATH: " + videoFilePath);
    console.log("FILE UPLOADED SUCCESSFULLY");
    console.log("TRANSCRIBING FILE NOW");

    const transcribeStartTime = new Date();
    const transcribeResponse = await axios.post(
      "http://127.0.0.1:8000/transcribe/local",
      {
        source: videoFilePath,
        language: language,
      },
      {
        timeout: 30 * 60 * 1000, // 30 minutes timeout
      }
    );
    const transcribeEndTime = new Date();

    console.log("TRANSCRIPTION: " + transcribeResponse.data);
    console.log("TRANSCRIPTION COMPLETED SUCCESSFULLY");
    console.log("Transcription Time:", transcribeEndTime - transcribeStartTime, "ms");

    const transcript = transcribeResponse.data;

    let summary = "";

    console.log("SUMMARIZING TRANSCRIPT NOW");

    const summarizeStartTime = new Date();
    const summaryResponse = await axios.post("http://127.0.0.1:8000/summarize", {
      text: transcript,
    });
    const summarizeEndTime = new Date();

    summary = summaryResponse.data.summary;
    console.log("SUMMARY: " + summary);
    console.log("SUMMARIZATION COMPLETED SUCCESSFULLY");
    console.log("Summarization Time:", summarizeEndTime - summarizeStartTime, "ms");
    console.log("SENDING TEXT DATA BACK TO FRONTEND WEBSITE");

    res.json({ transcript, summary });
  } catch (error) {
    console.error("An error occurred while processing the file:", error);
    res.status(500).json({ message: "An error occurred while processing the file" });
  } finally {
    try {
      const files = fs.readdirSync(VIDEO_BASE_PATH);
      for (const file of files) {
        fs.unlinkSync(path.join(VIDEO_BASE_PATH, file));
      }
      console.log("Uploads folder cleared");
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  }
});

router.post("/transcription", upload.single("video"), async (req, res) => {
  try {
    const language = req.body.language;

    console.log("API REQUEST RECEIVED");
    console.log("UPLOADING FILE NOW");
    console.log("LANGUAGE: " + language);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const videoFilePath = req.file.path;

    console.log("VIDEO FILE PATH: " + videoFilePath);
    console.log("FILE UPLOADED SUCCESSFULLY");
    console.log("TRANSCRIBING FILE NOW");

    const transcribeStartTime = new Date();
    const transcribeResponse = await axios.post(
      "http://127.0.0.1:8000/transcribe/local",
      {
        source: videoFilePath,
        language: language,
      },
      {
        timeout: 30 * 60 * 1000, // 30 minutes timeout
      }
    );
    const transcribeEndTime = new Date();

    console.log("TRANSCRIPTION: " + transcribeResponse.data);
    console.log("TRANSCRIPTION COMPLETED SUCCESSFULLY");
    console.log("Transcription Time:", transcribeEndTime - transcribeStartTime, "ms");

    const transcript = transcribeResponse.data;

    console.log("SENDING TEXT DATA BACK TO FRONTEND WEBSITE");

    res.json({ transcript });
  } catch (error) {
    console.error("An error occurred while processing the file:", error);
    res.status(500).json({ message: "An error occurred while processing the file" });
  } finally {
    try {
      const files = fs.readdirSync(VIDEO_BASE_PATH);
      for (const file of files) {
        fs.unlinkSync(path.join(VIDEO_BASE_PATH, file));
      }
      console.log("Uploads folder cleared");
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  }
});

router.get('/test', (req, res) => {
  console.log("Here");
  const responseData = {
    message: 'Test endpoint response',
  };
  res.json(responseData);
});

// Increase the server timeout to 10 minutes (adjust as needed)
const server = express();
server.timeout = 30 * 60 * 1000; // 30 minutes timeout

server.use('/', router);

module.exports = server;