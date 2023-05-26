import { spawn } from "child_process";
import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

const eventEmitter = new EventEmitter();
const transcriptionResults = {}; // Store transcribed text results

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      // Get the video file from the request body
      // const videoFile = req.body.videoFilePath;
      const videoFileName = "5607.mp4";

      const videoFilePath = `${process.env.VIDEO_BASE_PATH}/${videoFileName}`;

      const jobID = uuidv4(); // generate a unique job ID

      const scriptPath = "../main.py";

      const pythonProcess = spawn("python3", [
        "main.py", //from root Frontend's perspective somehow
        videoFilePath, //from Frontend's perspective
        "transcribe_local_audio",
      ]);
      console.log("loading");

      let result = "";
      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
        // console.log(result);
      });

      pythonProcess.on("error", (error) => {
        console.error(
          "Error occurred while executing the Python script:",
          error
        );
      });

      pythonProcess.on("close", (code) => {
        console.log("Finished calling main.py");
        if (code !== 0) {
          return res
            .status(500)
            .json({ message: "An error occurred while processing the file" });
        }
        transcriptionResults[jobID] = result; // Store the transcribed text result
        res.json({ message: "File uploaded successfully", jobID });

        // Emit the event after sending the response to the client
        eventEmitter.emit("transcriptionDone", { jobID });
      });
      break;
    case "GET":
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const { id } = req.query;
      console.log(req.query);
      if (!id) {
        return res.status(400).json({ message: "Missing jobID parameter" });
      }

      const listener = (data) => {
        console.log("Testing12345");
        const transcribedText = transcriptionResults[id];
        res.write(`data: ${JSON.stringify({ transcribedText })}\n\n`);
        console.log("We have successfully sent transcribed text to client");
      };

      // Check if the transcription is already done
      if (transcriptionResults[id]) {
        listener();
      }

      eventEmitter.on("transcriptionDone", listener);

      req.on("close", () => {
        eventEmitter.removeListener("transcriptionDone", listener);
        res.end();
      });

      break;
  }
}
