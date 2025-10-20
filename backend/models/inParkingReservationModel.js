//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const inParkingReservationSchema = new mongoose.Schema(
  {
    //reservation ID
    reservationID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //vehicle ID
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
      trim: true,
    },

    //contact number
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    // Calendar day of reservation
    date: {
      type: String,
      required: true,
      trim: true
    },

    // Actual gate times
    entryTime: {
      type: Date,
      required: true
    },
    exitTime: {
      type: Date,
      required: false,
      default: null
    },

    //duration
    duration: {
      type: String,
      required: false,
      default: null
    },
    
    //reservation status
    status: {
      type: String,
      required: true,
      enum: ["Reserved", "Completed", "Cancelled", "Pending", "Awaiting Payment"],
      default: "Pending",
      trim: true,
    },

    //foriegn keys
    //slot iD
    slotID: {
      type: String,
      enum: ["A01", "A02", "A03", "A04", "B01", "B02", "B03", "B04"],
      required: true,
      trim: true,
    },

    //payment ID
    paymentID: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },

    //vehicleID
    vehicleID: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("InParkingReservation",inParkingReservationSchema);