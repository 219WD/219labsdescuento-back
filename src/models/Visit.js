const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  ip: { type: String, unique: true, required: true },
  date: { type: Date, default: Date.now }
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
