const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    length: { type: Number, required: true },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
  });

const File = mongoose.models.File || mongoose.model("File", fileSchema);

export default File;