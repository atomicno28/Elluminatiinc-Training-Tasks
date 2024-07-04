import mongoose from "mongoose";

const UserListSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  countrycode: String,
});

export default mongoose.model("UserList", UserListSchema);
