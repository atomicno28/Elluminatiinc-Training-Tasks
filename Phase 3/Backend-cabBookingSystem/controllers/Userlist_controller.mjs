import UserList from "../models/UserList.mjs";

// Add User function
export const addUser = async (req, res) => {
  const { name, email, phone, countrycode } = req.body;

  try {
    // Check if a user with the same email already exists in UserList
    const existingUserEmail = await UserList.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Check if a user with the same phone already exists in UserList
    const existingUserPhone = await UserList.findOne({ phone });
    if (existingUserPhone) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    // Create a new UserList document
    const newUser = new UserList({ name, email, phone, countrycode });
    await newUser.save();

    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
};

// GetUsers

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortField;

  try {
    // Get the total number of users
    const totalUsers = await UserList.countDocuments();

    // Get and optionally sort the users
    let users = await UserList.find().skip(skip).limit(limit);
    if (sortField) {
      users = await UserList.find()
        .sort({ [sortField]: 1 })
        .skip(skip)
        .limit(limit);
    }

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

//Update user
export const updateUser = async (req, res) => {
  const { name, email, phone, countrycode } = req.body;
  const { id } = req.params; // Get the userId from the request URL

  try {
    // Find the user in UserList
    const userToUpdate = await UserList.findById(id);
    if (!userToUpdate) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if a user with the same email or phone already exists in UserList
    const emailExists = await UserList.findOne({ _id: { $ne: id }, email });
    const phoneExists = await UserList.findOne({ _id: { $ne: id }, phone });
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    // Update the user
    userToUpdate.name = name;
    userToUpdate.email = email;
    userToUpdate.phone = phone;
    userToUpdate.countrycode = countrycode;

    // Save the updated user
    await userToUpdate.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

// Delete user.
export const deleteUser = async (req, res) => {
  const { id } = req.params; // Get the id from the request URL

  try {
    // Check if the user exists
    const user = await UserList.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Delete the user
    await UserList.findOneAndDelete({ _id: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error to the console
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
};

//SearchUser
export const searchUsers = async (req, res) => {
  const { field, text } = req.query; // Get the field and text from the request query

  try {
    // Search in the UserList
    const results = await UserList.find({
      [field]: new RegExp(text, "i"),
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error searching users" });
  }
};
