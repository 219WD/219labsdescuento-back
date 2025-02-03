const express = require("express");
const Landing = require("../models/Landing");
const landingRouter = express.Router();

// Obtener los datos de la landing
landingRouter.get("/getLanding", async (req, res) => {
    try {
        const landing = await Landing.findOne(); // Obtener el primer documento de la landing
        if (!landing) {
            return res.status(404).json({ message: "No se encontró la landing" });
        }
        res.json(landing);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener la landing", error: err.message });
    }
});

// Crear la landing (solo si no existe)
landingRouter.post("/createLanding", async (req, res) => {
    try {
        const existingLanding = await Landing.findOne();
        if (existingLanding) {
            return res.status(400).json({ message: "Ya existe una landing, usa PUT para editar" });
        }

        const newLanding = new Landing(req.body);
        await newLanding.save();
        res.status(201).json(newLanding);
    } catch (err) {
        res.status(500).json({ message: "Error al crear la landing", error: err.message });
    }
});

// Actualizar los datos de la landing (siempre edita la única existente)
landingRouter.put("/editLanding", async (req, res) => {
    try {
        let landing = await Landing.findOne();
        if (!landing) {
            return res.status(404).json({ message: "No se encontró la landing, usa POST para crearla" });
        }

        // Actualizar la información existente
        Object.assign(landing, req.body);
        await landing.save();
        res.json({ message: "Landing actualizada correctamente", landing });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar la landing", error: err.message });
    }
});

module.exports = landingRouter;
