//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const paymentSchema = new mongoose.Schema(
  {
    //payment ID
    paymentID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //payment method
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Card", "Online", "Not Defined"],
      trim: true,
      default: "Not Defined"
    },

    //payment amount
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    //extra charge amount
    exAmount: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },

    //total payment amount
    total: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    //payment status
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Refunded", "Failed", "Cancelled"],
      default: "Pending",
      trim: true,
    },

    //date
    date: {
      type: String,
      required: false,
    },

    //foriegn keys
    //rate ID
    rateID: {
      type: String,
      required: true,
      trim: true,
      default: "Not Defined",
    },

    //extra rate ID
    exRateID: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },

    //refund ID
    refundID: {
      type: String,
      required: false,
      trim: true,
      default: null
    },

    //reservation ID
    reservationID : {
      type: String,
      required: false,
      trim: true,
      default: null
    },

    //online booking ID
    bookingID: {
      type: String,
      required: false,
      trim: true,
      default: null
    }
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("Payment", paymentSchema);