const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

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

const tempSchema = new mongoose.Schema({
  text_id: { type: String },
  transcript: { type: String, default: '__EMPTY__' },
  summary: { type: String, default: '__EMPTY__' },
});

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

    console.log("Request received");
    console.log("Uploading file...");
    console.log("Language: " + language);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const videoFilePath = req.file.path;

    console.log("Video file path: " + videoFilePath);
    console.log("File uploaded successfully");
    console.log("Transcribing file...");

    const temp = new Temp({ text_id, transcript: '__EMPTY__', summary: '__EMPTY__' });

    await temp.save();

    console.log("Temp object created in MongoDB");

    const transcribeStartTime = new Date();
    const transcribeResponse = await axios.post(
      "http://127.0.0.1:8000/transcribe/local",
      {
        source: videoFilePath,
        language: language,
      },
      {
        timeout: 0
      }
    );
    const transcribeEndTime = new Date();

    console.log("Transcription: " + transcribeResponse.data);
    console.log("Transcription completed successfully");
    console.log("Transcription time:", transcribeEndTime - transcribeStartTime, "ms");

    temp.transcript = transcribeResponse.data;
    await temp.save();

    console.log("Temp object updated in MongoDB");

    let summary = "";

    console.log("Summarizing transcript...");

    const summarizeStartTime = new Date();
    const summaryResponse = await axios.post("http://127.0.0.1:8000/summarize", {
      text: transcribeResponse.data,
    });
    const summarizeEndTime = new Date();

    summary = summaryResponse.data.summary;
    console.log("Summary: " + summary);
    console.log("Summarization completed successfully");
    console.log("Summarization time:", summarizeEndTime - summarizeStartTime, "ms");

    temp.summary = summary;
    await temp.save();

    console.log("Temp object updated in MongoDB");
    console.log("Sending text data back to frontend website");

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

    console.log("Request received");
    console.log("Uploading file...");
    console.log("Language: " + language);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const videoFilePath = req.file.path;

    console.log("Video file path: " + videoFilePath);
    console.log("File uploaded successfully");
    console.log("Transcribing file...");

    const temp = new Temp({ text_id, transcript: '__EMPTY__', summary: '__EMPTY__' });

    await temp.save();

    console.log("Temp object created in MongoDB");

    const transcribeStartTime = new Date();
    const transcribeResponse = await axios.post(
      "http://127.0.0.1:8000/transcribe/local",
      {
        source: videoFilePath,
        language: language,
      },
      {
        timeout: 0
      }
    );
    const transcribeEndTime = new Date();

    console.log("Transcription: " + transcribeResponse.data);
    console.log("Transcription completed successfully");
    console.log("Transcription time:", transcribeEndTime - transcribeStartTime, "ms");

    const transcript = transcribeResponse.data;

    temp.transcript = transcribeResponse.data;
    await temp.save();

    console.log("Temp object updated in MongoDB");
    console.log("Sending text data back to frontend website");

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

const server = express();
server.timeout = 0;
server.use('/', router);

module.exports = server;