import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  vehicleTypes: String,
  name: String,
  logo: String,
});

export default mongoose.model("Vehicle", VehicleSchema);
