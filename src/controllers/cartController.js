const Cart = require('../models/Cart');

// Obtener todos los carritos
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos', error });
  }
};

// Crear un nuevo carrito
exports.createCart = async (req, res) => {
  const { userId, items, paymentMethod } = req.body;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  try {
    const newCart = new Cart({ userId, items, total, paymentMethod });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error });
  }
};

// Actualizar un carrito
exports.updateCart = async (req, res) => {
  const { id } = req.params;
  const { items, paymentMethod } = req.body;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { items, paymentMethod },
      { new: true }
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
};

// Eliminar un carrito
exports.deleteCart = async (req, res) => {
  const { id } = req.params;

  try {
    await Cart.findByIdAndDelete(id);
    res.json({ message: 'Carrito eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito', error });
  }
};

// Marcar un carrito como pagado
exports.markAsPaid = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { paid: true },
      { new: true }
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar como pagado', error });
  }
};

exports.agregarProductoCarrito = async (req, res) => {
  try {
      const { usuarioId, productoId, cantidad } = req.body;

      // Validar que todos los datos estén presentes
      if (!usuarioId || !productoId || !cantidad) {
          return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
      }

      // Buscar el producto en la base de datos
      const producto = await Producto.findById(productoId);
      if (!producto) {
          return res.status(404).json({ mensaje: "Producto no encontrado." });
      }

      // Buscar el carrito del usuario o crear uno nuevo
      let carrito = await Carrito.findOne({ usuarioId });
      if (!carrito) {
          carrito = new Carrito({ usuarioId, productos: [], total: 0 });
      }

      // Buscar si el producto ya está en el carrito
      const productoEnCarrito = carrito.productos.find(p => p.productoId.toString() === productoId);

      if (productoEnCarrito) {
          // Si el producto ya está en el carrito, actualiza la cantidad
          productoEnCarrito.cantidad += cantidad;
      } else {
          // Si el producto no está en el carrito, agrégalo
          carrito.productos.push({
              productoId: producto._id,
              nombre: producto.nombre,
              precio: producto.precio,
              cantidad
          });
      }

      // Recalcular el total del carrito
      carrito.total = carrito.productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

      // Guardar el carrito actualizado
      await carrito.save();

      res.status(200).json({ mensaje: "Producto agregado al carrito.", carrito });
  } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ mensaje: "Error al agregar producto al carrito.", error });
  }
};
