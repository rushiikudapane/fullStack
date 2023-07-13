const router = require("express").Router();
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//UPDATE USER

router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  console.log(req.body.username);
  if (req.body.password) {
    req.body.password = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    // console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ err: err });
  }
});

//DELETE USER
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: "user has been deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err });
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    return res.status(200).json(others);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err });
  }
});

//GET ALL USERS
router.get("/find", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err });
  }
});

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  // returns last years todays date
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    // to get data of users registered in last year
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json(data);
  } catch (err) {
    consolr.log(err);
    return res.status(500).json({ err: err });
  }
});

module.exports = router;
