const User = require("../models/User");

exports.getDB = async (req, res) => {
  try {
    const data = await User.find({});
    return data;
  } catch (err) {
    res.status(500).send("Error in Fetching data from User.");
    return null;
  }
};
// Homepage <- (GET)
exports.homepage = async (req, res) => {
  const data = await exports.getDB();
  res.render("form", { data });
};

// Form -> (POST)
exports.postDB = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    // Server-side validation
    if (password.length < 8) {
      res.json({
        field: "password",
        message: "Password must be at least 8 characters.",
      });
      return;
    }

    var phoneRegex = /^\d{10}$/;
    if (!phone.match(phoneRegex)) {
      res.json({
        field: "phone",
        message: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    const user = await User.findOne({ username });
    const emailUser = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        field: "username",
        message: "Username already exists in the database.",
      });
    } else if (emailUser) {
      res.status(400).json({
        field: "email",
        message: "Email already exists in the database.",
      });
    } else {
      const newUser = new User({ username, password, email, phone });
      await newUser.save();
      res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

exports.deleteDB = async function (userId) {
  try {
    // Use Mongoose to delete the user by ID
    await User.findByIdAndDelete(userId);
    console.log("User deleted successfully from the database.");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // Propagate the error to handle it elsewhere if needed
  }
};

exports.updateDB = async function (userId, data) {
  try {
    // Check for empty fields
    if (!data.field || !data.value) {
      return {
        status: 400,
        error: {
          field: "editInput",
          message: "Both field and value are required.",
        },
      };
    }

    // Prepare the update object
    let update = {};
    update[data.field] = data.value;

    // Check for duplicate username or email
    if (data.field === "username" || data.field === "email") {
      const duplicate = await User.findOne(update);
      if (duplicate && String(duplicate._id) !== String(userId)) {
        return {
          status: 400,
          error: {
            field: data.field,
            message: `${
              data.field.charAt(0).toUpperCase() + data.field.slice(1)
            } is already in use.`,
          },
        };
      }
    }

    await User.findByIdAndUpdate(userId, update);
    return {
      status: 200,
      message: "User updated successfully in the database.",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return { status: 500, message: "An error occurred." };
  }
};

exports.searchDB = async (req, res) => {
  const { searchOption, searchInput } = req.body;

  try {
    const results = await User.find({ [searchOption]: searchInput });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
