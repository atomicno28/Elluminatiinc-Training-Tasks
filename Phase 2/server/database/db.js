// db.js
const mongoose = require("mongoose");

async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    console.log("Database connected...");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  dbConnection,
};
