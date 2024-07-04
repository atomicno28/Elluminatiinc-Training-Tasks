import mongoose from "mongoose";

const CountrySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Currency: { type: String, required: true },
  CountryCode: { type: String, required: true },
  CountryCallingCode: { type: String, required: true },
  TimeZone: { type: String, required: true },
});

export default mongoose.model("Country", CountrySchema);
