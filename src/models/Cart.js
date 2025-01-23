const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
      cantidad: { type: Number, required: true },
    },
  ],
  total: { type: Number, default: 0 },
  estado: { type: String, enum: ["contactado", "pendiente", "cerrado"], default: "pendiente" }, // Estado del carrito
  formaDePago: { type: String, enum: ["efectivo", "transferencia", "mercadopago"], default: "efectivo" }, // Método de pago
}, { timestamps: true });

module.exports = mongoose.model("Carrito", CarritoSchema);
