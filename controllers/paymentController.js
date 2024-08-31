require("dotenv").config();
const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");

const stripe = require("stripe")(process.env.STRIPE_KEY);

//metodo conectar con pasarela y realizar pago
exports.doPayment = async (req, res) => {
  try {
    const { currency, productName, amount } = req.body;

    // console.log("currency  : ", currency);
    // console.log("productName  : ", productName);
    // console.log("amount  : ", amount);

    if (!currency || !productName || !amount) {
      return res.status(400).json({ error: "Faltan datos en la solicitud" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName,
            },
            unit_amount: amount, // Monto en centavos (ejemplo: $10.00)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error al crear sesión de checkout en Stripe:", error);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};

//metodo verificar el estado del pago
exports.verifyPayment = async (req, res) => {
  const session_id = req.params.session_id;
  const { beneficiaryId, supportAmount } = req.body;

  // console.log("session_id :", session_id);
  try {
    // Recuperar la sesión de pago
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Recuperar el PaymentIntent asociado
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );

    // Recuperar el PaymentMethod asociado al PaymentIntent
    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentIntent.payment_method
    );

    // Consultar el producto usando el beneficiaryId
    const product = await Product.findById(beneficiaryId);

    if (session.payment_status === "paid") {
      // console.log(session);
      const payment = new Payment({
        transactionId: session.id,
        dateTime: new Date(session.created * 1000),
        amount: session.amount_total / 100,
        currency: session.currency,

        donor: {
          userId: session.client_reference_id,
          name: session.customer_details.name,
          email: session.customer_details.email,
        },

        beneficiary: {
          beneficiaryId: product._id,
          name: product.name,
        },

        paymentMethod: {
          type: paymentMethod.type,
          lastFourDigits: paymentMethod.card.last4,
        },

        supportNanna:{
          supportAmount: supportAmount,
        },

      });

      // Guarda el documento en la base de datos
      await payment.save();

      // Aquí puedes realizar acciones adicionales, como actualizar tu base de datos
      res.status(200).json({ message: "Pago exitoso", session });
    } else {
      res.status(400).json({ message: "El pago no fue exitoso" });
    }
  } catch (error) {
    console.error("Error al recuperar la sesión:", error);
    res.status(500).json({ error: "Error al verificar el pago" });
  }
};
