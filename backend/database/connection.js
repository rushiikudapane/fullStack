const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Connection = () =>
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Database connected successfully!!!"))
    .catch((err) => console.log(`Error Occured while connecting to Database. Error ${err}`));

module.exports = Connection;
