const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');


const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploads

const UsedBike = mongoose.model('UsedBikes', {
  title: String,
  description: String,
  year: Number,
  price: Number,
  condition: String,
  availabilityStatus: Boolean,
  color: String,
  image: String, 
  category: String,
  // Assuming the image is stored as a base64 string
  // Add other fields as needed
});

// POST route to save bike data with image upload
router.post('/admin/api/bikes', upload.single('image'), async (req, res) => {
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
      availabilityStatus: req.body.availabilityStatus,
      color: req.body.color,
      image: req.body.image,
    });

    await newBike.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving bike:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to retrieve all bikes
router.get('/admin/api/bikes', async (req, res) => {
  try {
    const bikes = await UsedBike.find();
    res.json(bikes);
  } catch (error) {
    console.error('Error retrieving bikes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to retrieve a specific bike by ID
router.get('/admin/api/bikes/:id', async (req, res) => {
  try {
    const bike = await UsedBike.findById(req.params.id);
    res.json(bike);
  } catch (error) {
    console.error('Error retrieving bike by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT route to update a specific bike by ID
router.put('/admin/api/bikes/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description, year, price, condition, availabilityStatus, color, category } = req.body;

    // Convert the uploaded image to base64
    // const imageBuffer = req.file ? req.file.buffer : null;
    // const imageBase64 = imageBuffer ? imageBuffer.toString('base64') : null;

    await UsedBike.findByIdAndUpdate(req.params.id, {
      title,
      description,
      year,
      price,
      condition,
      availabilityStatus,
      color,
      category,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating bike by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE route to delete a specific bike by ID
router.delete('/admin/api/bikes/:id', async (req, res) => {
  try {
    await UsedBike.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting bike by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
