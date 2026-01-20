const cors = require("cors");
const createProxyMiddleware =
  require("http-proxy-middleware").createProxyMiddleware;
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

app.post("/api/collect", (req, res) => {
  res.json({ ok: true });
});
app.use(
  "/shop",
  createProxyMiddleware({
    target: "https://tbilling.myshopify.com",
    changeOrigin: true,
    secure: true,
  }),
);
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:9292",
      "http://127.0.0.1:9292",
      "https://tbilling.myshopify.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

// MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB connection error:", err));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: String, // For simplicity, we'll use a guest user ID
  items: [
    {
      productId: String,
      title: String,
      price: String,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to add products to the cart
app.post("/api/add-to-cart", async (req, res) => {
  const { productId, title, price } = req.body;

  console.log(productId, title, price, "req.body");

  const userId = "guest"; // Assuming guest for now (can be replaced with user ID after login)

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ productId, title, price }],
    });
  } else {
    cart.items.push({ productId, title, price });
  }

  await cart.save();

  res.json({ success: true });
});

app.post("/api/collect", async (req, res) => {
  console.log("harrypotter");
});
// Route to get the user's cart
app.get("/api/cart", async (req, res) => {
  console.log(res, "res");

  const userId = "guest"; // Replace with user session or actual user ID
  const cart = await Cart.findOne({ userId });
  res.json(cart);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
