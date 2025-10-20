//declaring a variable to import the slot model
const Slot = require("../models/slotModel");

// <<<------------------------- BASIC CRUD OPERATION FUNCTIONS ----------------------------->>>

// -----------> CREATE: add new slot
const createSlot = async function (req, res) {
    try {
        //assign values from request body
        const slotID = req.body?.slotID?.toString().trim();
        const status = req.body?.status?.toString().trim();

        //check required fields
        if (!slotID || !status) {
            return res.status(400).json({
                message: "slotID and status are required.",
                status: "error",
            });
        }

        //create new document
        const doc = await Slot.create({
            slotID: slotID,
            status: status,
            vehicleID: null,
        });

        return res.status(201).json({
            message: "Slot created successfully",
            slot: doc,
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

// -----------> READ-ONE: get slot by ID
const getSlotByID = async function (req, res) {
    try {
        //get slotID from URL params
        const slotID = req.params?.id?.toString().trim();

        if (!slotID) {
            return res.status(400).json({
                message: "id is required.",
                status: "error",
            });
        }

        //find the slot document
        const doc = await Slot.findOne({ slotID });

        if (!doc) {
            return res.status(404).json({
                message: "Slot not found",
                status: "error",
            });
        }

        return res.json({
            message: "Slot found successfully",
            slot: doc,
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

// -----------> READ-ALL: get all slots
// -----------> get all slots
const getAllSlots = async function (req, res) {
    try {
        //fetch all slot documents from database
        const slotList = await Slot.find().sort({ slotID: 1 });

        //if no slots found
        if (!slotList || slotList.length === 0) {
            return res.status(404).json({
                message: "No slots found",
                status: "error"
            });
        }

        //send success response with all slots
        return res.json({
            slots: slotList,
            message: "All slots fetched successfully",
            status: "success"
        });
    }

    //catch any error
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error"
        });
    }
};


// -----------> UPDATE: update slot by ID
const updateSlotByID = async function (req, res) {
    try {
        //get slotID from params
        const slotID = req.params?.id?.toString().trim();
        const status = req.body?.status?.toString().trim();

        if (!status || !slotID) {
            return res.status(400).json({
                message: "Slot id and status is required.",
                status: "error",
            });
        }

        //allowed fields to update
        const allowed = ["status"];
        const payload = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined && req.body[key] !== null) {
                payload[key] = req.body[key];
            }
        }

        //perform update
        const result = await Slot.updateOne({ slotID }, { $set: payload });

        if (!result.matchedCount) {
            return res.status(404).json({
                message: "Slot not found",
                status: "error",
            });
        }

        //fetch updated doc
        const updated = await Slot.findOne({ slotID });

        return res.json({
            message: "Slot updated successfully",
            slot: updated,
            status: "success",
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error",
        });
    }
};
// -----------> DELETE: delete slot by ID
const deleteSlotByID = async function (req, res) {
    try {
        //get slotID from params
        const slotID = req.params?.id?.toString().trim();

        if (!slotID) {
            return res.status(400).json({
                message: "id is required.",
                status: "error",
            });
        }

        //delete document
        const result = await Slot.deleteOne({ slotID });

        if (!result.deletedCount) {
            return res.status(404).json({
                message: "Slot not found",
                status: "error",
            });
        }

        return res.json({
            message: "Slot deleted successfully",
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
    createSlot,
    getSlotByID,
    getAllSlots,
    updateSlotByID,
    deleteSlotByID,
};
