import connectMongo from "../../utils/connectMongo";
import Temp from "../../models/temp";

export default async function extractTranscript(req, res) {
  try {
    console.log("API REQUEST HAS FAILED INITIALLY");

    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const { text_id, purpose } = req.body;

    const temp = await Temp.findOne({ text_id });

    if (!temp) {
      return res.status(404).json({ error: "Temp object not found" });
    }
    
    if (purpose == "Transcription") {
        if (temp.transcript === "__EMPTY__") {
            return res.status(400).json({ error: "Transcript is empty" });
        } else {
            const text = temp.transcript;
        
            return res.json({ text });
        }
    } else {
        if (temp.summary === "__EMPTY__") {
            return res.status(400).json({ error: "Transcript and Summary is empty" });
            // }
        } else {
            const text = temp.summary;
        
            return res.json({ text });
        }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "An error occurred" });
  } 
}