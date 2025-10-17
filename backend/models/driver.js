//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const driverSchema = new mongoose.Schema(
  {
    //driver ID
    driverID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //user name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    //age
    age: {
      type: Number,
      required: true,
      min: 16,
    },

    //National Idenity Card Number
    NIC: {
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

    //email address
    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    //account password
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("Driver", driverSchema);