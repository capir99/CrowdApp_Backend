require("dotenv").config();
const User = require("../models/userModel");

// Configuración del transportador de Nodemailer
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // clave de aplicación de google https://myaccount.google.com/apppasswords
  },
});

// Método para crear un nuevo usuario
exports.addUser = async (req, res) => {
  try {
    // Verificar si el email ya existe en la base de datos
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json("El email ya está registrado.");
    }

    // Generar un código de confirmación
    const confirmationCode = crypto.randomBytes(20).toString("hex");

    // Crear un nuevo usuario
    const user = new User({
      name: req.body.name,
      surname: req.body.surname,
      date_creation: req.body.date_creation,
      email: req.body.email,
      phone: req.body.phone,
      state: req.body.state,
      rol: req.body.rol,
      password: req.body.password,
      confirmationCode: confirmationCode, // Asignar el código de confirmación
      isConfirmed: false, // Inicialmente no está confirmado
    });

    const back_url = process.env.BACKEND_URL;

    // Guardar el usuario
    const createdUser = await user.save();

    // URL de verificación
    const enlaceUrl = `${back_url}/verify-email?code=${confirmationCode}&email=${encodeURIComponent(
      createdUser.email
    )}`;

    // Enviar el correo con el código de confirmación
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: createdUser.email,
      subject: "NanaPass - confirmación de correo",
      text: `Por favor, confirma tu correo electrónico usando el siguiente enlace: ${enlaceUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json("Usuario creado exitosamente. Por favor, verifica tu correo.");
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json("Error al crear usuario");
  }
};
// // Método para crear un nuevo usuario
// exports.addUser = async (req, res) => {
//   try {
//     // Generar un código de confirmación
//     const confirmationCode = crypto.randomBytes(20).toString("hex");

//     // Crear un nuevo usuario
//     const user = new User({
//       name: req.body.name,
//       surname: req.body.surname,
//       date_creation: req.body.date_creation,
//       email: req.body.email,
//       phone: req.body.phone,
//       state: req.body.state,
//       rol: req.body.rol,
//       password: req.body.password,
//       confirmationCode: confirmationCode, // Asignar el código de confirmación
//       isConfirmed: false, // Inicialmente no está confirmado
//     });

//     const back_url = process.env.BACKEND_URL;

//     // Guardar el usuario
//     const createdUser = await user.save();

//     // URL de verificación
//     const enlaceUrl = `${back_url}/verify-email?code=${confirmationCode}&email=${encodeURIComponent(
//       createdUser.email
//     )}`;

//     // Enviar el correo con el código de confirmación
//     const mailOptions = {
//       from: "nanapasscrowdapp@gmail.com",
//       to: createdUser.email,
//       subject: "NanaPass - confirmación de correo",
//       text: `Por favor, confirma tu correo electrónico usando el siguiente enlace: ${enlaceUrl}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res
//       .status(201)
//       .json("Usuario creado exitosamente. Por favor, verifica tu correo.");
//   } catch (error) {
//     console.error("Error al crear usuario:", error);
//     res.status(500).json("Error al crear usuario");
//   }
// };

exports.confirmEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Buscar el usuario por email y código de confirmación
    const user = await User.findOne({ email: email, confirmationCode: code });

    if (!user) {
      return res
        .status(400)
        .json("Código de confirmación inválido o ya ha sido utilizado.");
    }

    // Confirmar el correo del usuario
    user.isConfirmed = true;
    user.confirmationCode = undefined; // Limpiar el código de confirmación
    await user.save();

    res.status(200).json("Correo confirmado exitosamente.");
  } catch (error) {
    console.error("Error al confirmar correo:", error);
    res.status(500).json("Error al confirmar correo.");
  }
};

exports.loginUser = async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Se necesita un Usuario (email) y contraseña" });
  }

  try {
    // Buscar al usuario por su email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Usuario (email) o contraseña invalidos" });
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    if (user.password !== password) {
      return res.status(401).json({ message: "Contraseña invalida" });
    }

    // Responder con el token y otros datos del usuario si es necesario
    res.json({
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        state: user.state,
        rol: user.rol,
        isConfirmed: user.isConfirmed,
      },
    });
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({ message: "Error de Servidor" });
  }
};

//metodo para consultar un usuario por su email
exports.getUserByEmail = (req, res) => {
  const searchEmail = req.params.searchEmail;

  // Crear un filtro para buscar coincidencias en el campo email
  const filter = {
    $or: [{ email: { $regex: searchEmail, $options: "i" } }],
  };

  User.find(filter).then((userResult) => {
    if (userResult) {
      res.status(200).json(userResult);
    } else {
      res.status(404).json("Usuario no encontrado");
    }
  });
};

// //metodo para modificar un usuario existente desde usuario
// exports.modifyUser = (req, res) => {
//   console.log("Encontre el id: ", req.params.id);
//   const filter = { _id: req.params.id };
//   console.log("Encontre : ", filter);
//   User.findOne(filter).then((userResult) => {
//     if (userResult) {

//       console.log("valor : ", req.body.name);
//       userResult.name = req.body.name;
//       userResult.surname = req.body.surname;
//       userResult.phone = req.body.phone;
//       userResult.email = req.body.email;
//       userResult.password = req.body.password;
//       // userResult.save().then(() => {
//       //   res
//       //     .status(201)
//       //     .json("Datos básicos usuario actualizados satisfactoriamente");
//       // });
//     } else {
//       res.status(404).json("Usuario no encontrado");
//     }
//   });
// };

exports.modifyUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userResult = await User.findById(userId);

    if (userResult) {
      userResult.name = req.body.name || userResult.name;
      userResult.surname = req.body.surname || userResult.surname;
      userResult.phone = req.body.phone || userResult.phone;
      userResult.email = req.body.email || userResult.email;
      userResult.password = req.body.password || userResult.password; // Corregido

      await userResult.save();

      res
        .status(200)
        .json("Datos básicos del usuario actualizados satisfactoriamente");
    } else {
      res.status(404).json("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json("Error interno del servidor");
  }
};
