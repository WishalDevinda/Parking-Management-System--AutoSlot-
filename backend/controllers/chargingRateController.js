//declaring a variable to import the charging rate model
const ChargingRate = require("../models/chargingRateModel");
const { generateID } = require("../utils/helperFunctions");

// <<<------------------------- BASIC CRUD OPERATION FUNCTIONS ----------------------------->>>

// -----------> CREATE: add new charging rate
const createChargingRate = async function (req, res) {
    try {
        //assign values from request body
        const rateID = "R" + generateID();
        const vehicleType = req.body?.vehicleType?.toString().trim();
        const ratePerHour = Number(req.body?.ratePerHour);

        //validate required fields
        if (!vehicleType || Number.isNaN(ratePerHour)) {
            return res.status(400).json({
                message: "vehicleType and ratePerHour are required",
                status: "error",
            });
        }

        //create new document
        const doc = await ChargingRate.create({
            rateID: rateID,
            vehicleType: vehicleType,
            ratePerHour: ratePerHour,
        });

        return res.status(201).json({
            message: "Charging rate created successfully",
            chargingRate: doc,
            status: "success",
        });
    } 
    
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error",
        });
    }
};

// -----------> READ-ONE: get charging rate by ID
const getChargingRateByID = async function (req, res) {
    try {
        //get rateID from URL params
        const rateID = req.params?.id?.toString().trim();

        if (!rateID) {
            return res.status(400).json({
                message: "id is required.",
                status: "error",
            });
        }

        //find the document
        const doc = await ChargingRate.findOne({ rateID });

        if (!doc) {
            return res.status(404).json({
                message: "Charging rate not found",
                status: "error",
            });
        }

        return res.json({
            message: "Charging rate found successfully",
            chargingRate: doc,
            status: "success",
        });
    } 

    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error",
        });
    }
};

// -----------> get all charging rates
const getAllChargingRates = async function (req, res) {
  try {
    //declaring a variable to get all the charging rates
    const chargingRateList = await ChargingRate.find().sort({ vehicleType: 1 });

    //send the charging rate list as a response
    return res.json({
      chargingRates: chargingRateList,
      message: "All Charging Rates Fetched Successfully.",
      status: "success"
    });
  }

  //if fetching process has any issue, send an error message to frontend
  catch (err) {
    return res.status(500).json({
      message: err.message,
      status: "error"
    });
  }
};

// -----------> UPDATE: update charging rate by rateID (basic whitelist + updateOne)
const updateChargingRateByID = async function (req, res) {
  try {
    // get id
    const rateID = req.params?.id?.toString().trim();
    if (!rateID) {
      return res.status(400).json({ message: "id is required.", status: "error" });
    }

    // whitelist updatable fields
    const allowed = ["vehicleType", "ratePerHour"];
    const payload = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        payload[key] = req.body[key];
      }
    }

    // numeric checks if present
    if (payload.ratePerHour !== undefined && Number.isNaN(Number(payload.ratePerHour))) {
      return res.status(400).json({
        message: "ratePerHour must be a number",
        status: "error",
      });
    }

    // perform update
    const result = await ChargingRate.updateOne({ rateID }, { $set: payload });

    if (!result.matchedCount) {
      return res.status(404).json({ message: "Charging Rate not found", status: "error" });
    }

    // fetch updated document
    const updated = await ChargingRate.findOne({ rateID });

    return res.json({
      message: "Charging Rate updated successfully",
      chargingRate: updated,
      status: "success",
    });
  } 
  
  catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> DELETE: delete charging rate by ID
const deleteChargingRateByID = async function (req, res) {
    try {
        //get rateID from params
        const rateID = req.params?.id?.toString().trim();

        if (!rateID) {
            return res.status(400).json({
                message: "id is required.",
                status: "error",
            });
        }

        //delete document
        const result = await ChargingRate.deleteOne({ rateID });

        if (!result.deletedCount) {
            return res.status(404).json({
                message: "Charging rate not found",
                status: "error",
            });
        }

        return res.json({
            message: "Charging rate deleted successfully",
            status: "success",
        });
    } 
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error",
        });
    }
};

//export all functions
module.exports = {
    createChargingRate,
    getChargingRateByID,
    getAllChargingRates,
    updateChargingRateByID,
    deleteChargingRateByID,
};
