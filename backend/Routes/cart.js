const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//CREATE CART
router.post("/create", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// UPDATE CART
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    return res.status(200).json(updatedCart);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// DELETE CART
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    console.log("Cart has been Deleted");
    return res.status(200).json("Cart has been Deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// GET USER CART
router.post("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// GET ALL
router.get("/findall", verifyTokenAndAdmin, async (req, res) => {
  try {
    const cart = await Cart.find();

    console.log(cart);
    return res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
