// src/models/Email.js
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Aseguramos que los emails no se repitan
    lowercase: true, // Para que todos los emails sean en minúsculas
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
