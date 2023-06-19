import connectMongo from "../../utils/connectMongo";
import File from "../../models/file";

export default async function updateFile(req, res) {
  const { method, body } = req;

  switch (method) {
    case "PUT":
      try {
        const { id, name, content } = body;

        await connectMongo();

        // Find the file by its ID
        const file = await File.findById(id);

        if (!file) {
          return res.status(404).json({ error: "File not found" });
        }

        // Update the file properties
        file.name = name;
        file.content = content;

        // Save the updated file
        await file.save();

        res.status(200).json({ message: "File updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating the file" });
      }
      break;
    default:
      res.status(405).json({ error: `Method ${method} not allowed` });
      break;
  }
}