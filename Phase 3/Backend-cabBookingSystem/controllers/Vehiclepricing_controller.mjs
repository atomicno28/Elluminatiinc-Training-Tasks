import VehiclePricing from "../models/VehiclePricing.mjs";
import City from "../models/City.mjs";
import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.mjs";

export const createVehiclePricing = async (req, res) => {
  const { city, type } = req.body;
  console.log(req.body);

  try {
    // Check if city and type already exist
    const existingEntry = await VehiclePricing.findOne({ city, type });

    if (existingEntry) {
      return res.status(400).json({
        message: "This vehicle type is already listed in the specified city.",
      });
    }

    // Check if city exists
    const cityExists = await mongoose.model("City").exists({ _id: city });
    if (!cityExists) {
      return res.status(400).json({
        message: "The specified city does not exist.",
      });
    }

    // Optionally, check if type exists
    const typeExists = await mongoose.model("Vehicle").exists({ _id: type });
    if (!typeExists) {
      return res.status(400).json({
        message: "The specified vehicle type does not exist.",
      });
    }

    const vehiclePricing = new VehiclePricing(req.body);

    await vehiclePricing.save();
    res.status(201).json(vehiclePricing);
  } catch (error) {
    console.error("Error creating vehicle pricing:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating vehicle pricing." });
  }
};

export const getCitiesByCountryId = async (req, res) => {
  const { countryId } = req.params;

  try {
    const cities = await City.find({ country: countryId });
    res.status(200).json(cities);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getVehicleAvailability = async (req, res) => {
  const { location } = req.params;
  console.log(location);

  try {
    // Find the city that matches the location
    const city = await City.findOne({ name: location });
    if (!city) {
      return res.status(404).json({
        message: "City not found.",
      });
    }

    // Find all vehicles available in the city and populate the vehicle details
    const availableVehicles = await VehiclePricing.find({
      city: city._id,
    }).populate("type");

    // Map the results to include only necessary vehicle details
    const vehiclesWithDetails = availableVehicles.map((vehiclePricing) => ({
      name: vehiclePricing.type.name,
      logo: vehiclePricing.type.logo,
      vehicleTypes: vehiclePricing.type.vehicleTypes,
      pricePerUnitDistance: vehiclePricing.pricePerUnitDistance,
      pricePerUnitTime: vehiclePricing.pricePerUnitTime,
      minFare: vehiclePricing.minFare,
      basePrice: vehiclePricing.basePrice,
      distanceForBasePrice: vehiclePricing.distanceForBasePrice,
      maxSpace: vehiclePricing.maxSpace,
      driverProfit: vehiclePricing.driverProfit,
    }));

    res.status(200).json(vehiclesWithDetails);
  } catch (error) {
    console.error("Error fetching vehicle availability:", error);
    res.status(500).json({
      message: "An error occurred while fetching vehicle availability.",
    });
  }
};
