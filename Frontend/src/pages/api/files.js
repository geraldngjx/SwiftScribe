import connectMongo from "../../utils/connectMongo";
import File from "../../models/fileModel";

export default async function addFile(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    // Query the files from the MongoDB database
    const files = await File.find({});

    res.json({ files }); // Send the files data back as a response
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}