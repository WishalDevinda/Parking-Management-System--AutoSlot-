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

//create a basic test route
app.get('/', (req, res) => {
  res.json({
    message: 'Parking Management System (AutoSlot) API is running',
    time: new Date().toISOString()
  });
});

//import route files
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/inParkingReservation', require('./routes/inParkingReservationRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/rates', require('./routes/rateRoutes'));
app.use('/api/extrarates', require('./routes/extraRateRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/refunds', require('./routes/refundRoutes'));
app.use('/api/revenues', require('./routes/revenueRoutes'));
app.use('/api/hardware', require('./routes/hardwareRoutes'));

//if the test route doesn't send any response, fallback to 404 error
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));