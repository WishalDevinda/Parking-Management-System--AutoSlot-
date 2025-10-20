//declaring a variable to import the system hardware model
const SystemHardware = require("../models/systemHardwareModel");
const { generateID } = require("../utils/helperFunctions");

// <<<------------------------- BASIC CRUD OPERATION FUNCTIONS ----------------------------->>>

// -----------> CREATE: add new hardware
const createSystemHardware = async function (req, res) {
  try {
    //assign values from request body
    const hardwareID = req.body?.hardwareID?.toString().trim() || "HW" + generateID();
    const hardwareName = req.body?.hardwareName?.toString().trim();
    const hardwareType = req.body?.hardwareType?.toString().trim();
    const implementedDate = req.body?.implementedDate || Date.now();
    const lastMaintenanceDate = req.body?.lastMaintenanceDate || null;
    const hardwareStatus = req.body?.hardwareStatus?.toString().trim() || "Active";

    //validate required fields
    if (!hardwareName || !hardwareType) {
      return res.status(400).json({
        message: "hardwareName and hardwareType are required",
        status: "error",
      });
    }

    //create new document
    const doc = await SystemHardware.create({
      hardwareID: hardwareID,
      hardwareName: hardwareName,
      hardwareType: hardwareType,
      implementedDate: implementedDate,
      lastMaintenanceDate: lastMaintenanceDate,
      hardwareStatus: hardwareStatus,
    });

    return res.status(201).json({
      message: "System Hardware created successfully",
      systemHardware: doc,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

// -----------> READ-ONE: get hardware by ID
const getSystemHardwareByID = async function (req, res) {
  try {
    //get hardwareID from URL params
    const hardwareID = req.params?.id?.toString().trim();

    if (!hardwareID) {
      return res.status(400).json({
        message: "id is required.",
        status: "error",
      });
    }

    //find the document
    const doc = await SystemHardware.findOne({ hardwareID });

    if (!doc) {
      return res.status(404).json({
        message: "System Hardware not found",
        status: "error",
      });
    }

    return res.json({
      message: "System Hardware found successfully",
      systemHardware: doc,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

// -----------> READ-ALL: get all hardware
const getAllSystemHardware = async function (req, res) {
  try {
    //declaring a variable to get all the hardware records
    const hardwareList = await SystemHardware.find().sort({ _id: -1 });

    //send the hardware list as a response
    return res.json({
      systemHardware: hardwareList,
      message: "All System Hardware Fetched Successfully.",
      status: "success",
    });
  }

  //if fetching process has any issue, send an error message to frontend
  catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

// -----------> UPDATE: update hardware by ID (basic whitelist + updateOne)
const updateSystemHardwareByID = async function (req, res) {
  try {
    // get id
    const hardwareID = req.params?.id?.toString().trim();
    if (!hardwareID) {
      return res.status(400).json({
        message: "id is required.",
        status: "error",
      });
    }

    // whitelist updatable fields
    const allowed = [
      "hardwareName",
      "hardwareType",
      "implementedDate",
      "lastMaintenanceDate",
      "hardwareStatus",
    ];
    const payload = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        payload[key] = req.body[key];
      }
    }

    // perform update
    const result = await SystemHardware.updateOne({ hardwareID }, { $set: payload });

    if (!result.matchedCount) {
      return res.status(404).json({
        message: "System Hardware not found",
        status: "error",
      });
    }

    // fetch updated document
    const updated = await SystemHardware.findOne({ hardwareID });

    return res.json({
      message: "System Hardware updated successfully",
      systemHardware: updated,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

// -----------> DELETE: delete hardware by ID
const deleteSystemHardwareByID = async function (req, res) {
  try {
    //get hardwareID from params
    const hardwareID = req.params?.id?.toString().trim();

    if (!hardwareID) {
      return res.status(400).json({
        message: "id is required.",
        status: "error",
      });
    }

    //delete document
    const result = await SystemHardware.deleteOne({ hardwareID });

    if (!result.deletedCount) {
      return res.status(404).json({
        message: "System Hardware not found",
        status: "error",
      });
    }

    return res.json({
      message: "System Hardware deleted successfully",
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

//export all functions
module.exports = {
  createSystemHardware,
  getSystemHardwareByID,
  getAllSystemHardware,
  updateSystemHardwareByID,
  deleteSystemHardwareByID,
};
