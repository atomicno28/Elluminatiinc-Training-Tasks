// app.js
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const { dbConnection } = require("./server/database/db"); // Import the data and dbConnection from the db module

const app = express();

// Use body-parser middleware for handling form data
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.json() middleware for handling JSON data
app.use(express.json());

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");

// Connecting with the Database...
try {
  dbConnection();
  app.use("/", require("./server/routes/index"));
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error(err);
}
