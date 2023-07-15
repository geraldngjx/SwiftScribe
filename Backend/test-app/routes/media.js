const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:VrJdvxKgCbB7x6tK@cluster0.5mhgl.mongodb.net/SwiftScribe?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define the schema for the Temp collection
const tempSchema = new mongoose.Schema({
  text_id: { type: String },
  transcript: { type: String, default: '__EMPTY__' },
  summary: { type: String, default: '__EMPTY__' },
});

// Create the Temp model
const Temp = mongoose.models.Temp || mongoose.model('Temp', tempSchema);

const VIDEO_BASE_PATH = "./uploads";

router.use(cors());
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const storage = multer.diskStorage({
  destination: VIDEO_BASE_PATH,
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/extract", upload.single("video"), async (req, res) => {
  try {
    const language = req.body.language;
    const text_id = req.body.text_id;

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

    // Create a new Temp document with "__EMPTY__" values and set the text_id
    const temp = new Temp({ text_id, transcript: '__EMPTY__', summary: '__EMPTY__' });

    // Save the Temp document to MongoDB
    await temp.save();

    console.log("TEMP OBJECT CREATED IN MONGODB");

    const transcribeStartTime = new Date();
    const transcribeResponse = await axios.post(
      "http://127.0.0.1:8000/transcribe/local",
      {
        source: videoFilePath,
        language: language,
      },
      {
        // timeout: 120 * 60 * 1000, // 120 minutes timeout
        timeout: 0 // Remove Timeout Limit
      }
    );
    const transcribeEndTime = new Date();

    console.log("TRANSCRIPTION: " + transcribeResponse.data);
    console.log("TRANSCRIPTION COMPLETED SUCCESSFULLY");
    console.log("Transcription Time:", transcribeEndTime - transcribeStartTime, "ms");

    // Update the Temp document with the transcription
    temp.transcript = transcribeResponse.data;
    await temp.save();

    console.log("TEMP OBJECT UPDATED IN MONGODB");

    let summary = "";

    console.log("SUMMARIZING TRANSCRIPT NOW");

    const summarizeStartTime = new Date();
    const summaryResponse = await axios.post("http://127.0.0.1:8000/summarize", {
      text: transcribeResponse.data,
    });
    const summarizeEndTime = new Date();

    summary = summaryResponse.data.summary;
    console.log("SUMMARY: " + summary);
    console.log("SUMMARIZATION COMPLETED SUCCESSFULLY");
    console.log("Summarization Time:", summarizeEndTime - summarizeStartTime, "ms");

    // Update the Temp document with the summary
    temp.summary = summary;
    await temp.save();

    console.log("TEMP OBJECT UPDATED IN MONGODB");
    console.log("SENDING TEXT DATA BACK TO FRONTEND WEBSITE");

    res.json({ text_id: temp.text_id, transcript: temp.transcript, summary: temp.summary });
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
    const text_id = req.body.text_id;

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

    // Create a new Temp document with "__EMPTY__" values and set the text_id
    const temp = new Temp({ text_id, transcript: '__EMPTY__', summary: '__EMPTY__' });

    // Save the Temp document to MongoDB
    await temp.save();

    console.log("TEMP OBJECT CREATED IN MONGODB");

    const transcribeStartTime = new Date();
    const transcribeResponse = await axios.post(
      "http://127.0.0.1:8000/transcribe/local",
      {
        source: videoFilePath,
        language: language,
      },
      {
        // timeout: 120 * 60 * 1000, // 120 minutes timeout
        timeout: 0 // Remove Timeout Limit
      }
    );
    const transcribeEndTime = new Date();

    console.log("TRANSCRIPTION: " + transcribeResponse.data);
    console.log("TRANSCRIPTION COMPLETED SUCCESSFULLY");
    console.log("Transcription Time:", transcribeEndTime - transcribeStartTime, "ms");

    const transcript = transcribeResponse.data;

    // Update the Temp document with the transcription
    temp.transcript = transcribeResponse.data;
    await temp.save();

    console.log("TEMP OBJECT UPDATED IN MONGODB");

    console.log("SENDING TEXT DATA BACK TO FRONTEND WEBSITE");

    res.json({ text_id: temp.text_id, transcript });
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
// server.timeout = 120 * 60 * 1000; // 120 minutes timeout
server.timeout = 0; // Remove Timeout Limit

server.use('/', router);

module.exports = server;