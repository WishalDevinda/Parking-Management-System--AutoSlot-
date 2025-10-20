//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const slotSchema = new mongoose.Schema(
  {
    //slot ID
    slotID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //status
    status: {
      type: String,
      required: true,
      enum: ["Available", "Booked", "Occupied", "Maintenance"],
      default: "Available",
      trim: true,
    },

    // Temporary occupant vehicle (filled when Occupied/Reserved)
    vehicleID: {
      type: String,
      required: false,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("Slot", slotSchema);