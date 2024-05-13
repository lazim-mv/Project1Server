const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploads

const UsedBike = mongoose.model("UsedBikes", {
  title: String,
  description: String,
  year: Number,
  price: Number,
  condition: String,
  starredProduct: Boolean,
  color: String,
  image: String,
  category: String,
  purchaseDate: Date,
  soldDate: Date,
  listingAddedDate: Date,
  customerName: String,
  customerNumber: Number,
});

// POST route to save bike data with image upload
router.post("/admin/api/bikes", upload.single("image"), async (req, res) => {
  console.log(req.body); // Log the request body to check if image data is present
  console.log(req.file); // Log the uploaded file to check if it's received
  try {
    const newBike = new UsedBike({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      year: req.body.year,
      price: req.body.price,
      condition: req.body.condition,
      starredProduct: req.body.starredProduct,
      color: req.body.color,
      image: req.body.image,
      purchaseDate: req.body.purchaseDate,
      soldDate: req.body.soldDate,
      listingAddedDate: new Date(),
      customerName: req.body.customerName, 
      customerNumber: req.body.customerNumber,
    });

    await newBike.save();
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving bike:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to retrieve all bikes
router.get("/admin/api/bikes", async (req, res) => {
  try {
    const bikes = await UsedBike.find();
    res.json(bikes);
  } catch (error) {
    console.error("Error retrieving bikes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to retrieve a specific bike by ID
router.get("/admin/api/bikes/:id", async (req, res) => {
  try {
    const bike = await UsedBike.findById(req.params.id);
    res.json(bike);
  } catch (error) {
    console.error("Error retrieving bike by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT route to update a specific bike by ID
router.put("/admin/api/bikes/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      year,
      price,
      condition,
      starredProduct,
      color,
      category,
      purchaseDate,
      soldDate,
      customerName,
      customerNumber,
    } = req.body;

    await UsedBike.findByIdAndUpdate(req.params.id, {
      title,
      description,
      year,
      price,
      condition,
      starredProduct,
      color,
      category,
      purchaseDate,
      soldDate,
      customerName,
      customerNumber,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating bike by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE route to delete a specific bike by ID
router.delete("/admin/api/bikes/:id", async (req, res) => {
  try {
    await UsedBike.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting bike by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
