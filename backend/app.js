//declaring variables to import packeges
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//configure the dotenv package to load environment variables from a .env file
require('dotenv').config();

// Create Express app
const app = express();

//using middlewares for the express app
app.use(cors());
app.use(express.json());

//declaring a variable to store the mongoDB connection string
const MONGO_URL = process.env.MONGO_URL;

//connect to the mongoDB database
mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

//test route to test the database connection
app.get('/', (req, res) => {
  res.json({
    message: 'Parking Management System (AutoSlot) API is running',
    time: new Date().toISOString(),
  });
});

//import route files
//app.use('/api/drivers', require('./routes/driverRoutes'));

// fallback route for invalid paths
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));