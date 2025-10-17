//declaring a variable to import the mongoose package
const mongoose = require("mongoose");

//create a new mongoose schema
const systemHardwareSchema = new mongoose.Schema(
  {
    //hardware ID
    hardwareID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },

    //hardware name
    hardwareName: {
      type: String,
      required: true,
      trim: true,
    },

    //hardware type
    hardwareType: {
      type: String,
      enum: ["Camera", "Slot-Sensor"],
      required: true,
      trim: true,
    },

    //implemented date
    implementedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    //last maintenance date
    lastMaintenanceDate: {
      type: Date,
      required: false,
      default: null,
    },

    //hardware status
    hardwareStatus: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"],
      default: "Active",
      trim: true,
    },
  },
  { timestamps: true }
);

//export the schema as a mongoose model
module.exports = mongoose.model("SystemHardware", systemHardwareSchema);