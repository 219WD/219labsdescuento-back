const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  descuento: {
    type: String,
    default: "20%", // Ahora el descuento por defecto es 20%
  },
  suscripcion: {
    type: Boolean,
    required: true,
    default: true, // Ahora la suscripción es true por defecto
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
