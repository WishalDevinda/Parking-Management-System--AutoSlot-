//declaring a variable to import the mongoose packeage
const mongoose = require("mongoose");

//create a new mongoose schema
const onlineBookingSchema = new mongoose.Schema(
  {
    //booking ID
    bookingID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //user name
    userName: {
      type: String,
      required: true,
      trim: true,
    },

    //contact number
    contactNumber: {
      type: String,
      required: true,
      trim: true,
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
      trim: true,
    },

    // Booking date (calendar day)
    date: {
      type: Date,
      required: true,
    },

    // Planned entry/exit times selected by customer
    arrivalTime: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },

    // Lifecycle status of this booking
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
      trim: true,
    },

    // Actual gate times captured at the entry/exit counters
    entryTime: {
      type: Date,
      default: null,
    },
    exitTime: {
      type: Date,
      default: null,
    },

    // Foreign keys (stored as strings to keep models decoupled)
    //slot ID
    slotID: {
      type: String,
      required: true,
      enum: ["A01", "A02", "A03", "A04", "B01", "B02", "B03", "B04"],
      default: null,
      trim: true,
      ref : "Slot"
    },

    //payment ID
    paymentID: {
      type: String,
      default: null,
      trim: true,
      ref : "Payment"
    },

    //driver ID
    driverID: {
      type: String,
      default: null,
      trim: true,
      ref: "Driver"
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("OnlineBooking", onlineBookingSchema);