import connectMongo from "../../utils/connectMongo";
import File from "../../models/file";

export default async function addFile(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const { uid } = req.body;
      console.log("UID: " + uid);
      try {
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        // Query the files from the MongoDB database
        const files = await File.find({ uid });

        res.json({ files }); // Send the files data back as a response
      } catch (error) {
        console.log(error);
        res.json({ error });
      }
      break;
      
    case "GET":
      const fileId = req.query.fileId;
      try {
        console.log("CONNECTING TO MONGO");
        await connectMongo();
        console.log("CONNECTED TO MONGO");

        // Query the file from the MongoDB database based on the filename
        const file = await File.findOne({ _id: fileId });

        if (!file) {
          // Return a 404 status if the file is not found
          return res.status(404).json({ error: "File not found" });
        }

        res.json({ file }); // Send the file data back as a response
      } catch (error) {
        console.log(error);
        res.json({ error });
      }
      break;

    default:
      res.status(405).json({ error: `Method ${method} Not Allowed` });
      break;
  }
}