const { Router } = require("express");
const Carrito = require("../models/Cart");
const Producto = require("../models/Producto");

const carritoRouter = Router();

// Crear o agregar un producto al carrito
carritoRouter.post("/agregar", async (req, res) => {
    const { usuarioId, productoId, cantidad } = req.body;

    if (!usuarioId || !productoId || !cantidad || cantidad <= 0) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    try {
        const producto = await Producto.findById(productoId);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        let carrito = await Carrito.findOne({ usuarioId });
        if (!carrito) carrito = new Carrito({ usuarioId, productos: [] });

        const productoEnCarrito = carrito.productos.find((p) => p.productoId.equals(productoId));
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.productos.push({ productoId, cantidad });
        }

        // Recalcular el total usando Promise.all para mejorar el rendimiento
        const productosInfo = await Promise.all(
            carrito.productos.map((item) => Producto.findById(item.productoId))
        );

        carrito.total = carrito.productos.reduce((total, item, index) => {
            const prod = productosInfo[index];
            return total + (prod ? prod.price * item.cantidad : 0);
        }, 0);

        await carrito.save();
        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

// Obtener el carritos
carritoRouter.get("/verCarritos", async (req, res) => {
    try {
        // Obtener todos los carritos
        const carritos = await Carrito.find()
            .populate("productos.productoId")
            .populate("usuarioId", "name");

        // Verificar si hay carritos
        if (!carritos || carritos.length === 0) {
            return res.status(404).json({ message: "No se encontraron carritos" });
        }

        // Responder con los carritos encontrados
        res.status(200).json(carritos);
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        res.status(500).json({ error: "Hubo un error al obtener los carritos" });
    }
});

// Obtener el carrito del usuario
carritoRouter.get("/:usuarioId", async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const carrito = await Carrito.findOne({ usuarioId })
            .populate("productos.productoId")
            .populate("usuarioId", "name");
        if (!carrito) return res.status(404).json({ message: "Carrito vacío o no encontrado" });

        res.status(200).json(carrito);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Hubo un error al obtener el carrito" });
    }
});


// Actualizar forma de pago del carrito
carritoRouter.put("/formaPago/:usuarioId", async (req, res) => {
    const { usuarioId } = req.params;
    const { formaDePago } = req.body;

    try {
        const validFormasPago = ["efectivo", "transferencia", "mercadopago"];
        if (!validFormasPago.includes(formaDePago)) {
            return res.status(400).json({ error: "Forma de pago inválida" });
        }

        const carrito = await Carrito.findOne({ usuarioId });
        if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

        carrito.formaDePago = formaDePago;
        await carrito.save();

        res.status(200).json({ message: "Forma de Pago actualizada", carrito });
    } catch (error) {
        console.error("Error al actualizar la forma de Pago del carrito:", error);
        res.status(500).json({ error: "Error al actualizar la forma de Pago del carrito" });
    }
});

// Consultar carritos por estado
carritoRouter.get("/estado/:estado", async (req, res) => {
    const { estado } = req.params;

    try {
        const validEstados = ["contactado", "pendiente", "cerrado"];
        if (!validEstados.includes(estado)) {
            return res.status(400).json({ mensaje: "Estado inválido" });
        }

        const carritos = await Carrito.find({ estado })
            .populate("productos.productoId")
            .populate("usuarioId", "name");
        res.status(200).json(carritos);
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).json({ mensaje: "Error al obtener los carritos." });
    }
});

// Actualizar estado del carrito por carritoId
carritoRouter.put("/estado/:carritoId", async (req, res) => {
    const { carritoId } = req.params;
    const { estado } = req.body;

    try {
        const validEstados = ["contactado", "pendiente", "cerrado"];
        if (!validEstados.includes(estado)) {
            return res.status(400).json({ error: "Estado inválido" });
        }

        const carrito = await Carrito.findById(carritoId);
        if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

        carrito.estado = estado;
        await carrito.save();

        res.status(200).json({ message: "Estado actualizado", carrito });
    } catch (error) {
        console.error("Error al actualizar estado del carrito:", error);
        res.status(500).json({ error: "Error al actualizar el estado del carrito" });
    }
});


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