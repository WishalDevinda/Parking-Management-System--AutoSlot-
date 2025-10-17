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
      enum: ["Cash", "Card", "Online"],
      trim: true,
    },

    //payment amount
    amount: {
      type: Number,
      required: true,
      min: 0,
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
    },

    //payment status
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Refunded", "Failed", "Cancelled"],
      default: "Pending",
      trim: true,
    },

    //foriegn keys
    //rate ID
    rateID: {
      type: String,
      required: true,
      trim: true,
      default: null,
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
      default: null,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("Payment", paymentSchema);