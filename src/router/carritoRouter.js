const { Router } = require("express");
const Carrito = require("../models/Cart");
const Producto = require("../models/Producto");

const carritoRouter = Router();

// Crear o agregar un producto al carrito
carritoRouter.post("/agregar", async (req, res) => {
    const { usuarioId, productoId, cantidad } = req.body;

    try {
        // Verificar si el producto existe
        const producto = await Producto.findById(productoId);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        // Buscar carrito existente del usuario o crear uno nuevo
        let carrito = await Carrito.findOne({ usuarioId });
        if (!carrito) carrito = new Carrito({ usuarioId, productos: [] });

        // Buscar si el producto ya está en el carrito
        const productoEnCarrito = carrito.productos.find((p) => p.productoId.equals(productoId));
        if (productoEnCarrito) {
            // Actualizar cantidad si ya existe
            productoEnCarrito.cantidad += cantidad;
        } else {
            // Agregar nuevo producto al carrito
            carrito.productos.push({ productoId, cantidad });
        }

        // Recalcular el total
        carrito.total = 0;
        for (const item of carrito.productos) {
            const prod = await Producto.findById(item.productoId);
            carrito.total += prod.price * item.cantidad;
        }

        // Guardar el carrito
        await carrito.save();
        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

// Obtener el carrito del usuario
carritoRouter.get("/:usuarioId", async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const carrito = await Carrito.findOne({ usuarioId }).populate("productos.productoId");
        if (!carrito) return res.status(404).json({ message: "Carrito vacío o no encontrado" });

        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Hubo un error al obtener el carrito" });
    }
});

// Actualizar la cantidad de un producto en el carrito
// Actualizar la cantidad de un producto en el carrito
carritoRouter.put("/actualizar/:usuarioId/:productoId", async (req, res) => {
    const { usuarioId, productoId } = req.params;
    const { cantidad } = req.body;

    try {
        // Verificar si la cantidad es válida
        if (cantidad < 0) {
            return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
        }

        // Buscar el carrito del usuario
        const carrito = await Carrito.findOne({ usuarioId });
        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Buscar el producto en el carrito
        const producto = carrito.productos.find((p) => p.productoId.equals(productoId));
        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito" });
        }

        // Si la cantidad es 0, eliminar el producto del carrito
        if (cantidad === 0) {
            carrito.productos = carrito.productos.filter((p) => !p.productoId.equals(productoId));
        } else {
            // Actualizar la cantidad del producto
            producto.cantidad = cantidad;
        }

        // Recalcular el total del carrito
        carrito.total = 0;
        for (const item of carrito.productos) {
            const prod = await Producto.findById(item.productoId);
            if (!prod) {
                return res.status(404).json({ error: `Producto con ID ${item.productoId} no encontrado en la base de datos` });
            }
            carrito.total += prod.price * item.cantidad;
        }

        // Guardar el carrito actualizado
        await carrito.save();
        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al actualizar el carrito:", error);
        res.status(500).json({ error: "Hubo un error al actualizar el carrito" });
    }
});



// Eliminar un producto del carrito
carritoRouter.delete("/eliminar/:usuarioId/:productoId", async (req, res) => {
    const { usuarioId, productoId } = req.params;

    try {
        const carrito = await Carrito.findOne({ usuarioId });
        if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

        carrito.productos = carrito.productos.filter((p) => !p.productoId.equals(productoId));

        // Recalcular el total
        carrito.total = 0;
        for (const item of carrito.productos) {
            const prod = await Producto.findById(item.productoId);
            carrito.total += prod.price * item.cantidad;
        }

        await carrito.save();
        res.status(200).json({ message: "Producto eliminado del carrito", carrito });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Hubo un error al eliminar el producto del carrito" });
    }
});

// Limpiar el carrito del usuario
carritoRouter.delete("/limpiar/:usuarioId", async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const carrito = await Carrito.findOne({ usuarioId });
        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        // Limpiar los productos
        carrito.productos = [];
        carrito.total = 0;

        // Guardar el carrito
        await carrito.save();
        res.status(200).json({ message: "Carrito limpiado con éxito", carrito });
    } catch (error) {
        console.error("Error al limpiar el carrito:", error);
        res.status(500).json({ error: "Hubo un error al limpiar el carrito" });
    }
});

module.exports = carritoRouter;
