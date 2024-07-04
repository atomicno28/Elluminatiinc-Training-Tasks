import UserList from "../models/UserList.mjs";

export const getUserByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const user = await UserList.findOne({ phone: phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchVehicles = async (req, res) => {
  const { pickupLat, pickupLng } = req.query;

  if (!pickupLat || !pickupLng) {
    return res.status(400).json({ message: "Pickup location is required." });
  }

  try {
    const cities = await City.find({
      coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [pickupLng, pickupLat],
          },
          $maxDistance: 10000, // 10 km radius, adjust as needed
        },
      },
    }).select("_id");

    if (cities.length === 0) {
      return res
        .status(404)
        .json({ message: "No vehicles found near this location." });
    }

    const cityIds = cities.map((city) => city._id);

    const vehiclePricing = await VehiclePricing.find({ city: { $in: cityIds } })
      .populate("type")
      .populate("city")
      .populate("country");

    res.status(200).json(vehiclePricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
