const { Router } = require("express");
const Producto = require("../models/Producto");

const productoRouter = Router();

// Crear un producto
productoRouter.post("/crear", async (req, res) => {
  const { title, price, description, features, image } = req.body;

  try {
    const nuevoProducto = new Producto({
      title,
      price,
      description,
      features,
      image,
    });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "No se pudo crear el producto" });
  }
});

// Obtener todos los productos
productoRouter.get("/verProductos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "No se pudieron obtener los productos" });
  }
});

// Obtener un producto por ID
productoRouter.get("/verProducto:id", async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "No se pudo obtener el producto" });
  }
});

// Actualizar un producto
productoRouter.put("/actualizar/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, description, features, image } = req.body;

  try {
    const producto = await Producto.findByIdAndUpdate(
      id,
      { title, price, description, features, image },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "No se pudo actualizar el producto" });
  }
});

// Eliminar un producto
productoRouter.delete("/eliminar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByIdAndDelete(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "No se pudo eliminar el producto" });
  }
});

// Actualizar estado de un producto
productoRouter.put("/actualizarEstado/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Validar estado recibido
  if (!["activo", "inactivo"].includes(estado)) {
    return res.status(400).json({ error: "Estado inválido. Debe ser 'activo' o 'inactivo'." });
  }

  try {
    const producto = await Producto.findByIdAndUpdate(
      id,
      { estado },
      { new: true } // Devuelve el documento actualizado
    );
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Estado actualizado correctamente", producto });
  } catch (error) {
    console.error("Error al actualizar el estado del producto:", error);
    res.status(500).json({ error: "No se pudo actualizar el estado del producto" });
  }
});


module.exports = productoRouter;
