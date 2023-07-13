const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
  if (!req.body.username || !req.body.username || !req.body.username) {
    res.status(400).json("please enter details properly");
    return;
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }

  console.log("User Registered Successfully");
});

//Login
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ err: "Wrong credentials" });
    } else {
      //decrypt the hashed password
      const hashedPassword = CryptoJs.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const dcryptPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
      //   console.log(dcryptPassword);

      if (dcryptPassword !== password) {
        return res.status(401).json({ err: "Wrong Credentials" });
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          {
            expiresIn: "3d",
          }
        );
        console.log("user login successful");
        return res.status(200).json({ ...user._doc, accessToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
