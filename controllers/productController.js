const Product = require("../models/productModel");

//metodo para listar los productos
exports.getProducts = (req, res) => {
  Product.find()
    .then((postResult) => {
      if (postResult) {
        res.status(200).json(postResult);
      } else {
        res.status(404).json("Sin productos");
      }
    })
    .catch((err) => {
      console.log("error:", err);
    });
};

//metodo para crear un nuevo producto
exports.addProduct = (req, res) => {
  const product = new Product({
    imag: req.body.imag,
    name: req.body.name,
    title: req.body.title,
    location: req.body.location,
    invitation: req.body.invitation,
    details: req.body.details,
    helpways: req.body.helpways,
    likes: req.body.likes,
    category: req.body.category,
  });
  product.save().then((createdProduct) => {
    res.status(201).json("Producto creado satisfactoriamente");
  });
};

//metodo para modificar likes
exports.modifyLikes = (req, res) => {
  const filter = { _id: req.params.id };

  Product.findOne(filter).then((productResult) => {
    if (productResult) {
      productResult.likes = req.body.likes;
      productResult.save().then(() => {
        res.status(201).json("likes atualizados satisfactoriamente");
      });
    } else {
      res.status(404).json("Producto no encontrado");
    }
  });
};

//metodo para consultar un producto por su ID
exports.getProductoById = (req, res) => {
  Product.findById(req.params.id).then((productResult) => {
    if (productResult) {
      res.status(200).json(productResult);
    } else {
      res.status(404).json("Producto no encontrado");
    }
  });
};

//metodo para consultar un producto por su codigo
exports.getProductoByWord = (req, res) => {
  const searchText = req.params.searchText;

  // Crear un filtro para buscar coincidencias en los campos title y name
  const filter = {
    $or: [
      { title: { $regex: searchText, $options: "i" } },
      { name: { $regex: searchText, $options: "i" } },
    ],
  };

  Product.find(filter).then((productResult) => {
    if (productResult) {
      res.status(200).json(productResult);
    } else {
      res.status(404).json("Producto no encontrado");
    }
  });
};

//metodo para consultar un producto por su categoria
exports.getProductoByCategory = (req, res) => {
  const categoryText = req.params.category;

  // Crear un filtro para buscar coincidencias
  const filter = {
    $or: [{ category: { $regex: categoryText, $options: "i" } }],
  };

  Product.find(filter).then((productResult) => {
    if (productResult) {
      res.status(200).json(productResult);
    } else {
      res.status(404).json("Producto no encontrado");
    }
  });
};

//metodo para modificar un producto existente
exports.modifyProducto = (req, res) => {
  const filter = { _id: req.params.id };
  Product.findOne(filter).then((productResult) => {
    if (productResult) {
      productResult.imag = req.body.imag;
      productResult.name = req.body.name;
      productResult.title = req.body.title;
      productResult.location = req.body.location;
      productResult.invitation = req.body.invitation;
      productResult.details = req.body.details;
      productResult.helpways = req.body.helpways;
      productResult.likes = req.body.likes;
      productResult.category = req.body.category;
      productResult.save().then(() => {
        res.status(201).json("Producto actualizado satisfactoriamente");
      });
    } else {
      res.status(404).json("Producto no encontrado");
    }
  });
};

//metodo para eliminar un producto
exports.removeProducto = (req, res) => {
  const filter = { _id: req.params.id };
  Product.deleteOne(filter).then(() => {
    res.status(201).json("Producto eliminado satisfactoriamente");
  });
};
