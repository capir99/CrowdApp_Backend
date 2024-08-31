const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

//**************END POINTS*********************************************
//Crear session pasarela
router.post("/session", paymentController.doPayment);
//Verificar estado del pago
router.post("/success/:session_id", paymentController.verifyPayment);

module.exports = router;
