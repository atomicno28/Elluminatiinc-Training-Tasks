import Country from "../models/Country.mjs";

// Add Country function
export const addCountry = async (req, res) => {
  const { Name, Currency, CountryCode, CountryCallingCode, TimeZone, City } =
    req.body;

  try {
    // Check if a country with the same name already exists
    const countryExists = await Country.findOne({ Name });
    if (countryExists) {
      return res.status(400).json({ error: "Country already exists" });
    }

    // Create a new Country
    const country = new Country({
      Name,
      Currency,
      CountryCode,
      CountryCallingCode,
      TimeZone,
      City,
    });

    // Save the new country
    await country.save();

    res.status(200).json({ message: "Country added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding country" });
  }
};

// Get country
export const getCountries = async (req, res) => {
  try {
    // Fetch all countries
    const countries = await Country.find();

    res.status(200).json(countries);
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ error: "Token not verified" });
    } else {
      res.status(500).json({ error: "Error fetching countries" });
    }
  }
};
