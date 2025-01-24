const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  features: [{ type: String }], // Arreglo de características
  image: { type: String, required: true }, // Almacenará la ruta de la imagen
  estado: { type: String, enum: ["activo", "inactivo"], default: "activo" }, // Estado del producto
}, { timestamps: true });

module.exports = mongoose.model("Producto", ProductoSchema);
