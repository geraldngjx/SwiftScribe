import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

require("dotenv").config();

// const transcriptionResults = {}; // Store transcribed text results

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const videoFileName = "5607.mp4"; //still hardcoded
      const videoFilePath = `${process.env.VIDEO_BASE_PATH}/${videoFileName}`;
      const jobID = uuidv4(); // generate a unique job ID

      try {
        const transcribeResponse = await axios.post(
          "http://127.0.0.1:8000/transcribe/local",
          {
            source: videoFilePath,
          }
        );

        console.log("Transcription done");

        const transcript = transcribeResponse.data;

        // Then, summarize the transcript
        const summaryResponse = await axios.post(
          "http://127.0.0.1:8000/summarize",
          {
            text: transcript,
          }
        );

        const summary = summaryResponse.data.summary;

        console.log("Summarization done");

        // Return the transcript and summary to the client
        res.json({ transcript, summary, jobID });
      } catch (error) {
        console.error("An error occurred while processing the file:", error);
        res
          .status(500)
          .json({ message: "An error occurred while processing the file" });
      }
      break;
  }
}
