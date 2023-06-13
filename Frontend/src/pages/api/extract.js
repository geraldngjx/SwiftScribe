import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

require("dotenv").config();

// const eventEmitter = new EventEmitter();
const transcriptionResults = {}; // Store transcribed text results

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const videoFileName = "5607.mp4";
      const videoFilePath = `${process.env.VIDEO_BASE_PATH}/${videoFileName}`;
      const jobID = uuidv4(); // generate a unique job ID

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/transcribe/local",
          {
            source: videoFilePath,
          }
        );

        const { data } = response;
        const { jobID } = data;

        console.log("Yayyy done ");

        res.json({ message: data, jobID });

        // eventEmitter.emit("transcriptionDone", { jobID });
      } catch (error) {
        console.error("An error occurred while processing the file:", error);
        res
          .status(500)
          .json({ message: "An error occurred while processing the file" });
      }
      break;
    //   case "GET":
    //     res.setHeader("Content-Type", "text/event-stream");
    //     res.setHeader("Cache-Control", "no-cache");
    //     res.setHeader("Connection", "keep-alive");

    //     const { id } = req.query;
    //     console.log(req.query);
    //     if (!id) {
    //       return res.status(400).json({ message: "Missing jobID parameter" });
    //     }

    //     const listener = (data) => {
    //       console.log("Testing12345");
    //       const transcribedText = transcriptionResults[id];
    //       res.write(`data: ${JSON.stringify({ transcribedText })}\n\n`);
    //       console.log("We have successfully sent transcribed text to client");
    //     };

    //     // Check if the transcription is already done
    //     if (transcriptionResults[id]) {
    //       listener();
    //     }

    //     // eventEmitter.on("transcriptionDone", listener);

    //     req.on("close", () => {
    //       // eventEmitter.removeListener("transcriptionDone", listener);
    //       res.end();
    //     });

    //     break;
  }
}
