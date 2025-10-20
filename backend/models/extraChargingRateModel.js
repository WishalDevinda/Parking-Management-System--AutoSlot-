//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const extraChargingRateSchema = new mongoose.Schema(
  {
    //extra rate ID
    exRateID: {
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
    
    // Rate per 5 minutes
    ratePer5min: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("ExtraChargingRate", extraChargingRateSchema);