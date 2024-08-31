const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

//**************END POINTS*********************************************
//Listar productos
router.get("/list", productController.getProducts);
//Crear producto
router.post("/add", productController.addProduct);
//Actualizar likes
router.patch("/modifyLikes/:id", productController.modifyLikes);
//Consultar producto por parte de su nombre
router.get("/search/:searchText", productController.getProductoByWord);
//Consultar producto por categoria
router.get(
  "/searchCategory/:category",
  productController.getProductoByCategory
);
//Actualizar producto
router.post("/modify/:id", productController.modifyProducto);
//Eliminar producto
router.delete("/remove/:id", productController.removeProducto);
//Consultar producto por Id
router.get("/:id", productController.getProductoById);

module.exports = router;
