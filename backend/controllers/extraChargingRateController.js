//declaring a variable to import the extra charging rate model
const ExtraChargingRate = require("../models/extraChargingRateModel");
const { generateID } = require("../utils/helperFunctions");

// <<<------------------------- BASIC CRUD OPERATION FUNCTIONS ----------------------------->>>

// -----------> CREATE: add new extra charging rate
const createExtraChargingRate = async function (req, res) {
  try {
    //assign values from request body
    const exRateID = req.body?.exRateID?.toString().trim() || "ER" + generateID();
    const vehicleType = req.body?.vehicleType?.toString().trim();
    const ratePer5min = Number(req.body?.ratePer5min);

    //validate required fields
    if (!vehicleType || Number.isNaN(ratePer5min)) {
      return res.status(400).json({
        message: "vehicleType and ratePer5min are required",
        status: "error",
      });
    }

    //create new document
    const doc = await ExtraChargingRate.create({
      exRateID: exRateID,
      vehicleType: vehicleType,
      ratePer5min: ratePer5min,
    });

    return res.status(201).json({
      message: "Extra Charging Rate created successfully",
      extraChargingRate: doc,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

// -----------> READ-ONE: get extra charging rate by ID
const getExtraChargingRateByID = async function (req, res) {
  try {
    //get exRateID from URL params
    const exRateID = req.params?.id?.toString().trim();

    if (!exRateID) {
      return res.status(400).json({
        message: "id is required.",
        status: "error",
      });
    }

    //find the document
    const doc = await ExtraChargingRate.findOne({ exRateID });

    if (!doc) {
      return res.status(404).json({
        message: "Extra Charging Rate not found",
        status: "error",
      });
    }

    return res.json({
      message: "Extra Charging Rate found successfully",
      extraChargingRate: doc,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

// -----------> READ-ALL: get all extra charging rates
const getAllExtraChargingRates = async function (req, res) {
  try {
    //declaring a variable to get all the extra charging rates
    const rateList = await ExtraChargingRate.find().sort({ _id: -1 });

    //send the list as a response
    return res.json({
      extraChargingRates: rateList,
      message: "All Extra Charging Rates Fetched Successfully.",
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

// -----------> UPDATE: update extra charging rate by exRateID (basic whitelist + updateOne)
const updateExtraChargingRateByID = async function (req, res) {
  try {
    // get id
    const exRateID = req.params?.id?.toString().trim();
    if (!exRateID) {
      return res.status(400).json({
        message: "id is required.",
        status: "error",
      });
    }

    // whitelist updatable fields
    const allowed = ["vehicleType", "ratePer5min"];
    const payload = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        payload[key] = req.body[key];
      }
    }

    // numeric check if present
    if (payload.ratePer5min !== undefined && Number.isNaN(Number(payload.ratePer5min))) {
      return res.status(400).json({
        message: "ratePer5min must be a number",
        status: "error",
      });
    }

    // perform update
    const result = await ExtraChargingRate.updateOne({ exRateID }, { $set: payload });

    if (!result.matchedCount) {
      return res.status(404).json({
        message: "Extra Charging Rate not found",
        status: "error",
      });
    }

    // fetch updated document
    const updated = await ExtraChargingRate.findOne({ exRateID });

    return res.json({
      message: "Extra Charging Rate updated successfully",
      extraChargingRate: updated,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error",
    });
  }
};

// -----------> DELETE: delete extra charging rate by exRateID
const deleteExtraChargingRateByID = async function (req, res) {
  try {
    //get exRateID from params
    const exRateID = req.params?.id?.toString().trim();

    if (!exRateID) {
      return res.status(400).json({
        message: "id is required.",
        status: "error",
      });
    }

    //delete document
    const result = await ExtraChargingRate.deleteOne({ exRateID });

    if (!result.deletedCount) {
      return res.status(404).json({
        message: "Extra Charging Rate not found",
        status: "error",
      });
    }

    return res.json({
      message: "Extra Charging Rate deleted successfully",
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
  createExtraChargingRate,
  getExtraChargingRateByID,
  getAllExtraChargingRates,
  updateExtraChargingRateByID,
  deleteExtraChargingRateByID,
};
