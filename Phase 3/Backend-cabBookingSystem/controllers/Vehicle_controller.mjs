import Vehicle from "../models/Vehicle.mjs";

// here we can store the vehicleData.
export const addVehicle = async (req, res) => {
  const { vehicleTypes, name, logo } = req.body;

  try {
    // Check if a vehicle with the same type and name already exists
    const vehicleExists = await Vehicle.findOne({ vehicleTypes, name });
    if (vehicleExists) {
      return res
        .status(400)
        .json({ error: "Vehicle with this type and name already exists" });
    }

    // Create a new Vehicle document
    const newVehicle = new Vehicle({ vehicleTypes, name, logo });

    // Save the new vehicle
    await newVehicle.save();

    res.status(200).json({ message: "Vehicle added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding vehicle" });
  }
};

//GetVehicle
export const getVehicles = async (req, res) => {
  try {
    // Fetch all vehicles from the Vehicle model
    const vehicles = await Vehicle.find();

    res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching vehicles" });
  }
};

// UpdateVehicles
export const updateVehicle = async (req, res) => {
  const { vehicleTypes, name, logo, vehicleId } = req.body; // Get the vehicleId from the request body

  try {
    // Find the vehicle in Vehicle
    const vehicleToUpdate = await Vehicle.findById(vehicleId);
    if (!vehicleToUpdate) {
      return res.status(400).json({ error: "Vehicle does not exist" });
    }

    // Update the vehicle
    vehicleToUpdate.vehicleTypes = vehicleTypes;
    vehicleToUpdate.name = name;
    vehicleToUpdate.logo = logo;

    // Save the updated vehicle
    await vehicleToUpdate.save();

    res.status(200).json({ message: "Vehicle updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating vehicle" });
  }
};
