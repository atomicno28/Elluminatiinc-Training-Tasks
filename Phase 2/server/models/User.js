const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9_-]+$/.test(value);
      },
      message: "Invalid username format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (value) {
        return value.length >= 6;
      },
      message: "Password must be at least 6 characters long",
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    validate: {
      validator: function (value) {
        return /.+@.+\..+/.test(value);
      },
      message: "Invalid email format",
    },
  },
  phone: {
    type: Number,
    required: [true, "Phone is required"],
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: "Invalid phone number format",
    },
  },
});

module.exports = mongoose.model("User", UserSchema);
