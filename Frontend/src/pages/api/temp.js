import connectMongo from "../../utils/connectMongo";
import Temp from "../../models/temp";

export default async function extractTranscript(req, res) {
  try {
    console.log("API REQUEST HAS FAILED INITIALLY");

    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const { text_id, purpose, duration } = req.body;

    const temp = await Temp.findOne({ text_id });

    if (!temp) {
      return res.status(404).json({ error: "Temp object not found" });
    }

    let text = purpose === "Transcription" ? temp.transcript : temp.summary;

    const startTime = new Date().getTime(); // Start time in milliseconds
    let currentTime = startTime; // Current time starts with the start time

    // Start the loop with an interval of 1 minute
    const interval = setInterval(async () => {
      const updatedTemp = await Temp.findOne({ text_id });
      if (!updatedTemp) {
        clearInterval(interval); // Stop the loop
        return res.status(500).json({ error: "Failed to find updated Temp object" });
      }

      text = purpose === "Transcription" ? updatedTemp.transcript : updatedTemp.summary;

      // Check if the text field is still empty
      if (text !== "__EMPTY__") {
        clearInterval(interval); // Stop the loop
        // You can perform additional actions with the extracted text here
        return res.json({ text });
      }

      currentTime = new Date().getTime(); // Update the current time

      // Check if the duration from the start time exceeds the video duration x 2
      if (currentTime - startTime > duration * 2) {
        clearInterval(interval); // Stop the loop
        return res.status(500).json({ error: "Extraction timed out" });
      }
    }, 60000); // Interval of 1 minute
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}