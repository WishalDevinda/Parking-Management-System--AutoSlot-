//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const chargingRateSchema = new mongoose.Schema(
  {
    //rate ID
    rateID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //vehicle type
    vehicleType: {
      type: String,
      required: true,
      enum: ["Car", "Van", "Bike", "Bus", "Truck", "Cab"],
      trim: true,
    },

    // Base rate per hour for this vehicle type/day
    ratePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("ChargingRate", chargingRateSchema);