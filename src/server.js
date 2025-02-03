const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const emailRouter = require("./router/emailRouter");
const carritoRouter = require("./router/carritoRouter");
const productoRouter = require("./router/productoRouter");
const { loginRouter } = require("./router/login");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const visitRouter = require("./router/visitRouter");
const landingRouter = require("./router/landingRoutes");
require("./config/passport");
require('dotenv').config();

// Configuración de la base de datos
mongoose.connect(process.env.MONGO_URI, {
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
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite también PUT y DELETE
  allowedHeaders: ['Content-Type', 'Authorization'],
};

server.use(cors(corsOptions)); // Aplica CORS de forma específica
server.use(express.json()); // Habilita JSON en las solicitudes entrantes
server.use(passport.initialize());


// 📌 Configurar el limitador de solicitudes (100 peticiones cada 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 peticiones por IP en este tiempo
  message: { error: "Demasiadas solicitudes, intenta más tarde." },
  headers: true,
});

// Usar el router de email en la ruta específica
server.use(limiter); // <-- Aplicar globalmente el limitador
server.use("/descuento", emailRouter);
server.use("/carrito", carritoRouter);
server.use("/productos", productoRouter);
server.use("/auth", loginRouter);
server.use("/visitas", visitRouter);
server.use("/landing", landingRouter);

module.exports = server; // Exportar el servidor para que pueda ser usado en index.js
