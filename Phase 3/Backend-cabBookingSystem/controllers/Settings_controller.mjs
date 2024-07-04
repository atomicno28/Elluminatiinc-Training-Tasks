import User from "../models/User.mjs";
import UserList from "../models/UserList.mjs";
import Country from "../models/Country.mjs";
import City from "../models/City.mjs";

import multer from "multer";

// to store the image of vehicle.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// validating the token.
export const validateToken = async (req, res, next) => {
  try {
    res.status(200).send("Valid Token");
  } catch (err) {
    res.status(500).send("Error in validating..!");
  }
};


import Settings from "../models/Settting.mjs";

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(400).json({ error: "Settings not found" });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const setSettings = async (req, res) => {
  const { duration, stops } = req.body;
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ duration, stops });
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        { duration: duration, stop: stops },
        { new: true }
      );
    }
    await settings.save();
    res.status(200).json({ duration: settings.duration, stop: settings.stop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
