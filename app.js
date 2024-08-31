const express = require("express");
const app = express();
var cors = require("cors");
const multer = require("multer");

const upload = multer(); // Configuración básica de multer para manejar datos `multipart/form-data`

const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();

//Conexión base de datos
const mongoose = require("mongoose");
const URI = process.env.MONGODB_CONNECT;

//metodo conexión
try {
  mongoose.connect(URI).then(() => {
    console.log("Base de datos conectada!!!");
  });
} catch (error) {
  console.log("El error es: " + error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(upload.none()); // Si solo estás enviando campos de texto

app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
