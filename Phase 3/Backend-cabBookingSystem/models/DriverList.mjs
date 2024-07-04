import mongoose from "mongoose";

const DriverListSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  countrycode: String,
});

export default mongoose.model("DriverList", DriverListSchema);
