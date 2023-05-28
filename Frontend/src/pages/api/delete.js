import connectMongo from "../../utils/connectMongo";
import File from "../../models/fileModel";

export default async function deleteFile(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const { id } = req.body;

    console.log(id);

    // Find the file with the given ID and delete it
    const deletedFile = await File.findByIdAndDelete(id);

    if (!deletedFile) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete file" });
  }
}