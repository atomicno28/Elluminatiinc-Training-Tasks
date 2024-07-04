import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  duration: {
    type: Number,
    required: true,
    default: 10,
  },
  stop: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Settings", SettingsSchema);
