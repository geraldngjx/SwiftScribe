const mongoose = require('mongoose');

// Define the schema for the Temp collection
const tempSchema = new mongoose.Schema({
    text_id: { type: String },
    transcript: { type: String },
    summary: { type: String },
  });

// Create the Temp model
const Temp = mongoose.models.Temp || mongoose.model("Temp", tempSchema);

export default Temp;