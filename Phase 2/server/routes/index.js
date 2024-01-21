const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Homepage <-  (GET)
router.get("/", UserController.homepage);

// Form -> (POST)
router.post("/", UserController.postDB);

router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    await UserController.deleteDB(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit Form - (PUT request)
router.put("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const result = await UserController.updateDB(userId, data);
    if (result.status === 200) {
      res.json({ message: result.message });
    } else {
      res.status(result.status).json(result.error);
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json(error);
  }
});

router.post("/search", UserController.searchDB);

module.exports = router;
