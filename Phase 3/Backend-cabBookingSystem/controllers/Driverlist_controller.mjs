import DriverList from "../models/DriverList.mjs";

// Add Driver function
export const addDriver = async (req, res) => {
    const { name, email, phone, countrycode } = req.body;
  
    try {
      // Check if a driver with the same email already exists in DriverList
      const existingDriverEmail = await DriverList.findOne({ email });
      if (existingDriverEmail) {
        return res
          .status(400)
          .json({ error: "Driver with this email already exists" });
      }
  
      // Check if a driver with the same phone already exists in DriverList
      const existingDriverPhone = await DriverList.findOne({ phone });
      if (existingDriverPhone) {
        return res
          .status(400)
          .json({ error: "Driver with this phone number already exists" });
      }
  
      // Create a new DriverList document
      const newDriver = new DriverList({ name, email, phone, countrycode });
      await newDriver.save();
  
      res.status(200).json({ message: "Driver added successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error adding driver" });
    }
  };
  
  // GetDrivers
  export const getDrivers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField;
  
    try {
      // Get the total number of drivers
      const totalDrivers = await DriverList.countDocuments();
  
      // Get and optionally sort the drivers
      let drivers = await DriverList.find().skip(skip).limit(limit);
      if (sortField) {
        drivers = await DriverList.find()
          .sort({ [sortField]: 1 })
          .skip(skip)
          .limit(limit);
      }
  
      res.status(200).json({ drivers, totalDrivers });
    } catch (error) {
      res.status(500).json({ error: "Error fetching drivers" });
    }
  };
  
  // Update driver
  export const updateDriver = async (req, res) => {
    const { name, email, phone, countrycode } = req.body;
    const { id } = req.params; // Get the driverId from the request URL
  
    try {
      // Find the driver in DriverList
      const driverToUpdate = await DriverList.findById(id);
      if (!driverToUpdate) {
        return res.status(400).json({ error: "Driver does not exist" });
      }
  
      // Check if a driver with the same email or phone already exists in DriverList
      const emailExists = await DriverList.findOne({ _id: { $ne: id }, email });
      const phoneExists = await DriverList.findOne({ _id: { $ne: id }, phone });
      if (emailExists) {
        return res
          .status(400)
          .json({ error: "Driver with this email already exists" });
      }
      if (phoneExists) {
        return res
          .status(400)
          .json({ error: "Driver with this phone number already exists" });
      }
  
      // Update the driver
      driverToUpdate.name = name;
      driverToUpdate.email = email;
      driverToUpdate.phone = phone;
      driverToUpdate.countrycode = countrycode;
  
      // Save the updated driver
      await driverToUpdate.save();
  
      res.status(200).json({ message: "Driver updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error updating driver" });
    }
  };
  
  // Delete driver
  export const deleteDriver = async (req, res) => {
    const { id } = req.params; // Get the id from the request URL
  
    try {
      // Check if the driver exists
      const driver = await DriverList.findOne({ _id: id });
      if (!driver) {
        return res.status(400).json({ error: "Driver does not exist" });
      }
  
      // Delete the driver
      await DriverList.findOneAndDelete({ _id: id });
  
      res.status(200).json({ message: "Driver deleted successfully" });
    } catch (error) {
      console.error(error); // Log the error to the console
      res
        .status(500)
        .json({ error: "Error deleting driver", details: error.message });
    }
  };
  
  // Search drivers
  export const searchDrivers = async (req, res) => {
    const { field, text } = req.query; // Get the field and text from the request query
  
    try {
      // Search in the DriverList
      const results = await DriverList.find({
        [field]: new RegExp(text, "i"),
      });
  
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "Error searching drivers" });
    }
  };
  