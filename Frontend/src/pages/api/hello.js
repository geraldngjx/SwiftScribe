// for testing purposes

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      // Simply echo back the request body
      res.json(req.body);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
