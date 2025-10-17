//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const revenueSchema = new mongoose.Schema(
  {
    //revenue ID
    revenueID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //revenue amount
    revenueAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    //date(YYYY.MM)
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("Revenue", revenueSchema);