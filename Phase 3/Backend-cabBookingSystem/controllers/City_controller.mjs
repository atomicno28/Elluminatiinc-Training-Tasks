import Country from "../models/Country.mjs";
import City from "../models/City.mjs";

// Add City to Country function
export const addCity = async (req, res) => {
  try {
    const { country, city, coordinates } = req.body;
    // console.log(coordinates);

    // Find the country by name
    const newcountry = await Country.findOne({ Name: country });

    if (!newcountry) {
      return res.status(400).json({ error: "Country does not exist" });
    }

    // Check if the city already exists
    const existingCity = await City.findOne({
      name: city,
      country: newcountry._id,
    });

    if (existingCity) {
      return res.status(400).json({ error: "City already exists" });
    }

    // Create a new city
    const newCity = new City({
      name: city,
      country: newcountry._id,
      coordinates: coordinates,
    });

    await newCity.save();

    res.status(200).json({ message: "City added successfully", city: newCity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding city" });
  }
};

export const getCities = async (req, res) => {
  try {
    const { countryName } = req.params;

    // Find the country by name
    const country = await Country.findOne({ Name: countryName });

    if (!country) {
      return res.status(400).json({ error: "Country does not exist" });
    }

    // Find the cities in the country
    const cities = await City.find({ country: country._id });

    res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching cities" });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id, coordinates } = req.body;
    // console.log(coordinates);

    // Find the city by id
    const exis_city = await City.findById(id);

    if (!exis_city) {
      return res.status(400).json({ error: "City does not exist" });
    }

    // Update coordinates of the city
    exis_city.coordinates = coordinates;

    // Save the updated city
    const updatedCity = await exis_city.save();

    res.status(200).json({ message: "City updated successfully", updatedCity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating city" });
  }
};
