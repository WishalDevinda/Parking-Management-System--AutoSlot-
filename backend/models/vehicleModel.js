//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const vehicleSchema = new mongoose.Schema(
  {
    //vehicle ID
    vehicleID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //vehicle number
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
    },

    //vehicle type
    vehicleType: {
      type: String,
      required: true,
      enum: ["Car", "Van", "Bike", "Bus", "Truck", "Cab"],
      trim: true
    },

    //entry time
    entryTime: {
      type: Date,
      required: true,
    },

    //exit time
    exitTime: {
      type: Date,
      required: false,
      default: null
    },

    //date
    date: {
      type: String,
      required: true,
      trim: true
    },

    //status
    status: {
      type: String,
      required: true,
      enum: ["Waiting", "In-Parking", "Completed"],
      trim: true
    },

    //foriegn key
    //slot ID
    slotID: {
      type: String,
      required: true,
      trim: true
    }
  },
);

//export the vehicle schema as a mongoose model
module.exports = mongoose.model("Vehicle", vehicleSchema);