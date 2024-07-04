import express from "express";
import {
  validateToken,
  getSettings,
  setSettings,
} from "../controllers/Settings_controller.mjs";
import { register, login } from "../controllers/Auth_controller.mjs";
import {
  addCountry,
  getCountries,
} from "../controllers/Country_controller.mjs";
import {
  addUser,
  updateUser,
  getUsers,
  deleteUser,
  searchUsers,
} from "../controllers/Userlist_controller.mjs";
import {
  addDriver,
  updateDriver,
  getDrivers,
  deleteDriver,
  searchDrivers,
} from "../controllers/Driverlist_controller.mjs";

import {
  addVehicle,
  getVehicles,
  updateVehicle,
} from "../controllers/Vehicle_controller.mjs";

import {
  createVehiclePricing,
  getCitiesByCountryId,
  getVehicleAvailability,
} from "../controllers/Vehiclepricing_controller.mjs";

import {
  addCity,
  getCities,
  updateCity,
} from "../controllers/City_controller.mjs";

import { getUserByPhoneNumber } from "../controllers/createride_controller.mjs";

import { authenticateToken } from "../middlewares/middleware.mjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Users
router.post("/addUser", authenticateToken, addUser);
router.get("/getUsers", authenticateToken, getUsers);
router.put("/updateUser/:id", authenticateToken, updateUser);
router.delete("/deleteUser/:id", authenticateToken, deleteUser);
router.get("/searchUsers", authenticateToken, searchUsers);

// Drivers
router.post("/addDriver", authenticateToken, addDriver);
router.get("/getDrivers", authenticateToken, getDrivers);
router.put("/updateDriver/:id", authenticateToken, updateDriver);
router.delete("/deleteDriver/:id", authenticateToken, deleteDriver);
router.get("/searchDrivers", authenticateToken, searchDrivers);

// Countries
router.post("/addCountry", authenticateToken, addCountry);
router.get("/getCountries", authenticateToken, getCountries);

router.post("/validateToken", authenticateToken, validateToken);

// Vehicle
router.post("/addVehicle", authenticateToken, addVehicle);
router.get("/getVehicles", authenticateToken, getVehicles);
router.put("/updateVehicle", authenticateToken, updateVehicle);

// Vehicle Pricing
router.post("/vehiclePricing", authenticateToken, createVehiclePricing);
router.get("/cities/:countryId", authenticateToken, getCitiesByCountryId);
router.get(
  "/vehicle-availability/:location",
  authenticateToken,
  getVehicleAvailability
);

// City
router.post("/addCity", authenticateToken, addCity);
router.get("/getCities/:countryName", authenticateToken, getCities);
router.put("/updateCity", authenticateToken, updateCity);

// Requests
router.get(
  "/getUserByPhoneNumber/:phoneNumber",
  authenticateToken,
  getUserByPhoneNumber
);

//Settings
router.get("/getsettings", authenticateToken, getSettings);
router.put("/setsettings", authenticateToken, setSettings);

export default router;
