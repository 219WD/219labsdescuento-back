const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    content: { type: String, required: true }, // HTML con Handlebars
}, { timestamps: true });

module.exports = mongoose.model("Template", TemplateSchema);