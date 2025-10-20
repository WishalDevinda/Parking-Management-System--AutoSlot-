//declaring variables to import model.js files
const Driver = require("../models/driver");
const { issueToken } = require("../utils/auth");
const {
    generateID,
    isValidContactNumber,
    normalizeNumber,
} = require("../utils/helperFunctions");

// <<<------------------------- BASIC CRUD OPERATIONS (DRIVER) ----------------------------->>>

// -----------> CREATE: add a new driver (basic)
const createDriver = async function (req, res) {
    try {
        // assign request body values to variables
        const name = req.body?.name?.toString().trim();
        const age = Number(req.body?.age);
        const NIC = req.body?.NIC?.toString().trim();
        const contactNumber = req.body?.contactNumber?.toString().trim();
        const emailAddress = req.body?.emailAddress?.toString().trim().toLowerCase();
        const password = req.body?.password?.toString().trim();

        // basic validation
        if (!name || Number.isNaN(age) || !NIC || !contactNumber || !emailAddress || !password) {
            return res.status(400).json({
                message: "name, age, NIC, contactNumber, emailAddress and password are required",
                status: "error",
            });
        }
        if (age < 16) {
            return res.status(400).json({ message: "age must be 16 or above", status: "error" });
        }
        if (!isValidContactNumber(contactNumber)) {
            return res.status(400).json({ message: "Invalid contact number (need 10 digits)", status: "error" });
        }

        // create driver document
        const doc = await Driver.create({
            driverID: "D" + generateID(),
            name,
            age,
            NIC,
            contactNumber: normalizeNumber(contactNumber),
            emailAddress,
            password, // NOTE: store hashes in production; plain text kept here to match your current style
        });

        issueToken(
            { driverID: doc.driverID, emailAddress: doc.emailAddress }, // payload
            res
        );

        return res.status(201).json({
            message: "Driver created successfully",
            driver: doc,
            status: "success",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message, status: "error" });
    }
};

// -----------> READ-ONE: get driver by driverID
const getDriverByID = async function (req, res) {
    try {
        // get driverID from params
        const driverID = req.params?.id?.toString().trim();
        if (!driverID) {
            return res.status(400).json({ message: "id is required.", status: "error" });
        }

        // find driver
        const doc = await Driver.findOne({ driverID });

        if (!doc) {
            return res.status(404).json({ message: "Driver not found", status: "error" });
        }

        return res.json({
            driver: doc,
            message: "Driver was found",
            status: "success",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message, status: "error" });
    }
};

// -----------> get all drivers (latest first)
const getAllDrivers = async function (req, res) {
    try {
        //declaring a variable to get all the drivers
        const driverList = await Driver.find().sort({ _id: -1 });

        //send the driver list as a response
        return res.json({
            drivers: driverList,
            message: "All Drivers Fetched Successfully.",
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

// -----------> UPDATE: update driver by driverID (basic whitelist + updateOne)
const updateDriverByID = async function (req, res) {
    try {
        // get id
        const driverID = req.params?.id?.toString().trim();
        if (!driverID) {
            return res.status(400).json({ message: "id is required.", status: "error" });
        }

        // whitelist updatable fields
        const allowed = [
            "name",
            "age",
            "NIC",
            "contactNumber",
            "emailAddress",
            "password",
        ];

        const payload = {};
        for (const key of allowed) {
            if (req.body[key] !== undefined && req.body[key] !== null) {
                payload[key] = req.body[key];
            }
        }

        // normalize/validate if present
        if (payload.age !== undefined) {
            if (Number.isNaN(Number(payload.age))) {
                return res.status(400).json({ message: "age must be a number", status: "error" });
            }
            if (Number(payload.age) < 16) {
                return res.status(400).json({ message: "age must be 16 or above", status: "error" });
            }
        }
        if (payload.contactNumber !== undefined) {
            if (!isValidContactNumber(payload.contactNumber)) {
                return res.status(400).json({ message: "Invalid contact number (need 10 digits)", status: "error" });
            }
            payload.contactNumber = normalizeNumber(payload.contactNumber);
        }
        if (payload.emailAddress !== undefined) {
            payload.emailAddress = String(payload.emailAddress).trim().toLowerCase();
        }

        // perform update
        const result = await Driver.updateOne({ driverID }, { $set: payload });

        if (!result.matchedCount) {
            return res.status(404).json({ message: "Driver not found", status: "error" });
        }

        // fetch updated
        const updated = await Driver.findOne({ driverID });

        return res.json({
            message: "Driver updated successfully",
            driver: updated,
            status: "success",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message, status: "error" });
    }
};

// -----------> DELETE: delete driver by driverID
const deleteDriverByID = async function (req, res) {
    try {
        const driverID = req.params?.id?.toString().trim();
        if (!driverID) {
            return res.status(400).json({ message: "id is required.", status: "error" });
        }

        const result = await Driver.deleteOne({ driverID });

        if (!result.deletedCount) {
            return res.status(404).json({ message: "Driver not found", status: "error" });
        }

        return res.json({
            message: "Driver deleted successfully",
            status: "success",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message, status: "error" });
    }
};

// export functions
module.exports = {
    createDriver,
    getDriverByID,
    getAllDrivers,
    updateDriverByID,
    deleteDriverByID,
};
