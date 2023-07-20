import connectMongo from "../../utils/connectMongo";
import File from "../../models/file";

const formatBytesToMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

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

        // Calculate the total storage size of all files in bytes
        let totalStorage = files.reduce((total, file) => total + file.size, 0);

        // Convert total storage size to human-readable format
        const totalStorageFormatted = formatBytesToMB(totalStorage);

        res.json({ files, totalStorage: totalStorageFormatted }); // Send the files data and total storage as a response
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