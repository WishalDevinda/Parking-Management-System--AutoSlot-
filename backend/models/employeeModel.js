//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const employeeSchema = new mongoose.Schema(
  {
    //employee ID
    employeeID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //employee name
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

    //contact number
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    //National Idenity Card Number
    NIC: {
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


    role: {
      type: String,
      required: true,
      enum: ["System Admin", "Security Officer", "Billing Officer", "Technical Admin", "Counterer"],
      trim: true,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("Employee", employeeSchema);