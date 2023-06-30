const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require("uuid"); // Import uuidv4 from the uuid package

// router.post('/extract', upload.single('video'), (req, res) => {
//   // Check if a file was uploaded
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   // File uploaded successfully
//   const fileName = req.file.originalname;

//   // Extract audio using FFmpeg and convert to MP3
//   const outputFilePath = `${req.file.path}.mp3`;
//   const ffmpeg = spawn('ffmpeg', [
//     '-i',
//     req.file.path,
//     '-map',
//     '0:1',
//     '-vn',
//     '-acodec',
//     'libmp3lame',
//     outputFilePath,
//   ]);

//   ffmpeg.stderr.on('data', (data) => {
//     console.error('FFmpeg stderr:', data.toString());
//   });

//   ffmpeg.on('close', (code) => {
//     if (code === 0) {
//       res.json({ message: 'Audio extracted successfully', fileName, audioFile: outputFilePath });
//     } else {
//       res.status(500).json({ error: 'Failed to extract audio' });
//     }
//   });
// });

const VIDEO_BASE_PATH = "./uploads"; // Directory where the video files will be saved

// Multer configuration
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
    console.log("API REQUEST RECEIVED");
    console.log("UPLOADING FILE NOW");
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const videoFilePath = req.file.path;

    console.log("VIDEO FILE PATH: " + videoFilePath);
    console.log("FILE UPLOADED SUCCESSFULLY");
    console.log("TRANSCRIBING FILE NOW");

    // Make the transcription request to the local server
    const transcribeResponse = await axios.post(
      "http://127.0.0.1:8000/transcribe/local",
      {
        source: videoFilePath,
      }
    );

    console.log("TRANSCRIPTION: " + transcribeResponse.data);
    console.log("TRANSCRIPTION COMPLETED SUCCESSFULLY");

    const transcript = transcribeResponse.data;

    let summary = "";

    // Summarize the transcript (if needed)
    const summaryResponse = await axios.post("http://127.0.0.1:8000/summarize", {
      text: transcript,
    });
    summary = summaryResponse.data.summary;
    console.log("SUMMARY: " + summary);
    console.log("SUMMARISATION COMPLETED SUCCESSFULLY");
    console.log("SENDING TEXT DATA BACK TO FRONTEND WEBSITE");

    // Return the transcript and summary to the client
    res.json({ transcript, summary });
  } catch (error) {
    console.error("An error occurred while processing the file:", error);
    res.status(500).json({ message: "An error occurred while processing the file" });
  } finally {
    // Clear the '/uploads' folder
    const uploadsFolder = "./uploads";

    fs.readdir(uploadsFolder, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
      } else {
        for (const file of files) {
          fs.unlink(path.join(uploadsFolder, file), (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            }
          });
        }
        console.log("Uploads folder cleared");
      }
    });
  }
});

// GET /test endpoint for testing purposes
router.get('/test', (req, res) => {
  console.log("Here");
  // Create a sample JSON response
  const responseData = {
    message: 'Test endpoint response',
  };

  // Send the JSON response
  res.json(responseData);
});

module.exports = router;
