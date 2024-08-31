const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//**************END POINTS*********************************************

//Crear usuario
router.post("/add", userController.addUser);
//Verificar codigo de creación de usuario
router.post("/verify", userController.confirmEmail);
//Realizar login
router.post("/login", userController.loginUser);
//Consultar un usuario por parte de su correo
router.get("/search/:searchEmail", userController.getUserByEmail);

//Actualizar usuario
router.post("/modify/:id", userController.modifyUser);

module.exports = router;
