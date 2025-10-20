//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const refundSchema = new mongoose.Schema(
  {
    //refund ID
    refundID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //reason for the refund
    reason: {
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

    //requested date
    requestedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    //refundedDate
    refundedDate: {
        type: Date,
        required: false,
        default: null
    },

    // Customer portion (80%) and company portion (20%)
    //customer amount
    customerAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    //company amount
    companyAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    //refund status
    status: {
      type: String,
      required: true,
      enum: ["Requested", "Approved", "Rejected", "Processed"],
      default: "Requested",
      trim: true,
    },

    //foriegn keys
    //payment ID
    paymentID: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("Refund", refundSchema);