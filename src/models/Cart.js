const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
      cantidad: { type: Number, required: true },
    },
  ],
  total: { type: Number, default: 0 }, // Mantener esto para cálculos rápidos.
}, { timestamps: true });

module.exports = mongoose.model("Carrito", CarritoSchema);
