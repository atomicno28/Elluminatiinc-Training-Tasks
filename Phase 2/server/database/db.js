// db.js
const mongoose = require("mongoose");
const UserController = require("../controllers/UserController");

async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    console.log("Database connected...");
    await UserController.getDB();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  dbConnection,
};
