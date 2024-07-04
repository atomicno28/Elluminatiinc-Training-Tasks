import mongoose from "mongoose";

const VehiclePricingSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  driverProfit: { type: Number, required: true },
  minFare: { type: Number, required: true },
  distanceForBasePrice: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  pricePerUnitDistance: { type: Number, required: true },
  pricePerUnitTime: { type: Number, required: true },
  maxSpace: { type: Number, required: true },
});

// Compound unique index on city and type
VehiclePricingSchema.index({ city: 1, type: 1 }, { unique: true });

export default mongoose.model("VehiclePricing", VehiclePricingSchema);
