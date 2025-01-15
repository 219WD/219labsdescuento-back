const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const emailRouter = require("./router/emailRouter");

// Configuración de la base de datos
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://kaspercanepa:TJae7gqBnSlQF3II@219emails.w0gev.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Conectado a MongoDB");
}).catch((error) => {
  console.error("Error al conectar a MongoDB", error);
});

const server = express();

// Configurar CORS para permitir tanto localhost como el dominio en producción
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://219labs-descuento.vercel.app', // Dominio en producción
      'http://localhost:5173',              // Localhost para desarrollo
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

server.use(cors(corsOptions)); // Aplica CORS de forma específica
server.use(express.json()); // Habilita JSON en las solicitudes entrantes

// Usar el router de email en la ruta específica
server.use("/descuento", emailRouter);

module.exports = server; // Exportar el servidor para que pueda ser usado en index.js
