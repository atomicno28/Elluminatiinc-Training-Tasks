import mongoose from "mongoose";

const CoordinateSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
});

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  coordinates: [CoordinateSchema], // Each city has one set of coordinates representing the zone
});

export default mongoose.model("City", CitySchema);
