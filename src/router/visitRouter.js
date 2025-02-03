const express = require("express");
const Visit = require("../models/Visit");

const visitRouter = express.Router();

visitRouter.get("/", async (req, res) => {
    try {
        // Obtener la IP del usuario
        const userIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        
        // Verificar si la IP ya está registrada
        const existingVisit = await Visit.findOne({ ip: userIp });

        if (!existingVisit) {
            // Guardar nueva visita
            await Visit.create({ ip: userIp });
        }

        // Contar las visitas totales
        const totalVisits = await Visit.countDocuments();
        
        res.json({ totalVisits });
    } catch (error) {
        console.error("Error contando visitas:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = visitRouter;
