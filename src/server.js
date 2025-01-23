const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const emailRouter = require("./router/emailRouter");
const carritoRouter = require("./router/carritoRouter");
const productoRouter = require("./router/productoRouter");
const { loginRouter } = require("./router/login");
const passport = require("passport");
require("./config/passport");
require('dotenv').config();

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
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite también PUT y DELETE
  allowedHeaders: ['Content-Type'],
};

server.use(cors(corsOptions)); // Aplica CORS de forma específica
server.use(express.json()); // Habilita JSON en las solicitudes entrantes
server.use(passport.initialize());

// Usar el router de email en la ruta específica
server.use("/descuento", emailRouter);
server.use("/carrito", carritoRouter);
server.use("/productos", productoRouter);
server.use("/auth", loginRouter);

module.exports = server; // Exportar el servidor para que pueda ser usado en index.js
