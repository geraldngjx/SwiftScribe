import connectMongo from "../../utils/connectMongo";
import File from "../../models/fileModel";

export default async function addFile(req, res) {
  try {
    console.log("CONNECTING TO MONGO");
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const body = req.body;

    const file = new File({ 
      name: body.name,
      length: body.length,
      content: body.content
     });

    await file
      .save()
      .then()
      .catch((e) => console.log(e));

    res.json({ file });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
}
