const express = require("express");
const Connection = require("./database/connection");
const dotenv = require("dotenv");

const cors = require("cors");

// Routes
const auth = require("./Routes/auth");
const updateUser = require("./Routes/user");
const products = require("./Routes/products");
const orders = require("./Routes/order");
const cart = require("./Routes/cart");

dotenv.config();

const checkout = require("./Routes/stripe");

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/user", updateUser);
app.use("/api/products", products);
app.use("/api/order", orders);
app.use("/api/cart", cart);
app.use("/api/checkout", checkout);

Connection();

app.get("/api/test", (req, res) => {
  res.send("Working fine!!!");
});

app.listen(process.env.PORT, () => {
  console.log(`server started at port ${process.env.PORT}`);
});
