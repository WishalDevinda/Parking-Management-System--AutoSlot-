//declaring a variable to import the in parking reservation model
const inParkingReservation = require("../models/inParkingReservationModel");
const payment = require("../models/paymentModel");
const {
    generateID,
    generateTime,
    generateDate,
    isValidContactNumber,
    normalizeNumber,
    calculateDuration
} = require("../utils/helperFunctions");

// <<<------------------------- CRUD Operation Functions ----------------------------->>>

//-----------> get reservation by ID
const getReservationByID = async function (req, res) {
    try {
        //declaring a variable to get the reservation ID from the url
        const reservationID = req.params?.id?.toString().trim();

        //check the reservation id availability in the request
        if (!reservationID) {
            return res.status(400).json({
                message: "id is required.",
                status: "error"
            });
        }

        //search the required document in the database
        const doc = await inParkingReservation.findOne({ reservationID: reservationID });

        //if it doesn't found
        if (!doc) {
            return res.status(404).json({
                message: "Reservation not found",
                status: "error"
            });
        }

        //if the was found
        return res.json({
            reservation: doc,
            message: "Reservation was found",
            status: "success"
        })
    }

    //if the fetching process have any issues
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error"
        });
    }
}

//-----------> get all reservations
const getAllReservations = async function (req, res) {
    try {
        //delcaring a variable to get all the reservations
        const reservationList = await inParkingReservation.find().sort({ date: -1, entryTime: -1 });

        //send the reservation list as a response
        return res.json({
            reservations: reservationList,
            message: "All Reservations Fetched Successfully.",
            status: "success"
        })
    }

    //if fetching process have any issue, send an error message to frontend
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error"
        })
    }
}

// <<<---------------------- Special Controller Functions ---------------------------->>>

//-------------> create reservation
const createReservation = async function (req, res) {
    try {
        //assign the req body values to variables
        const vehicleNumber = req.body.vehicleNumber;
        const vehicleType = req.body.vehicleType;
        const contactNumber = req.body.contactNumber;
        const slotID = req.body.slotID;


        //send error message as a response for required fields
        if (!vehicleNumber || !contactNumber || !vehicleType || !slotID) {
            return res.status(400).json({
                message:
                    "vehicleNumber, contactNumber, vehicleType and slotID are required",
                status: "error",
            });
        }

        //send an error as a response if the contact number doesn't have 10 digits
        if (!isValidContactNumber(contactNumber)) {
            return res.status(400).json({
                message: "Invalid contact number (need 10 digits)",
                status: "error",
            });
        }

        //create a new document
        const doc = await inParkingReservation.create({
            reservationID: 'IPR' + generateID(),
            vehicleNumber: String(vehicleNumber).toUpperCase(),
            vehicleType: vehicleType,
            contactNumber: normalizeNumber(contactNumber),
            date: generateDate(),
            entryTime: generateTime(),
            exitTime: null,
            duration: null,
            status: "Reserved",
            slotID: String(slotID).trim(),
            paymentID: null
        });

        //send a message in the response
        return res.status(201).json({
            message: "Reservation created successfully",
            reservation: doc,
            status: "success"
        });
    }
    //send an error message if there any problem with the reservation process
    catch (err) {
        return res.status(500).json({
            message: err.message,
            status: "error"
        });
    }
}


//----------> end reservation
const endReservation = async function (req, res) {
    try {
        //declaring a variable to assign the parameter value
        const vehicleNumber = req.params?.vehicleNumber?.toString().trim().toUpperCase();

        //display an error message if the id doesn't exist in the parameter
        if (!vehicleNumber) {
            return res.status(400).json({
                message: "vehicle number is required",
                status: "error"
            });
        }

        //find the entryTime of the reservation
        let doc = await inParkingReservation.findOne({ vehicleNumber: vehicleNumber, status: "Reserved" });

        //if the dicument was not found
        if (!doc) {
            return res.status(404).json({ message: "Reservation not found", status: "error" });
        }

        //generate the exitTime and calculate the duration
        const exitTime = generateTime();
        const duration = calculateDuration(doc.entryTime, exitTime);

        //update the exit time
        let updateReservation = await inParkingReservation.updateOne(
            { vehicleNumber: vehicleNumber, status: "Reserved" },
            { $set: { exitTime: exitTime, duration: duration } });

        //if failed to update the reservation exit time, display an error message
        if (!updateReservation.matchedCount) {
            return res.status(404).json({
                message: "Reservation not found",
                status: "error"
            })
        }

        //create a new payment ID
        const paymentID = 'P' + generateID();

        //update the reservation again to insert the duration
        updateReservation = await inParkingReservation.updateOne(
            { vehicleNumber: vehicleNumber, status: "Reserved" },
            { $set: { paymentID: paymentID } });

        //if failed to update the reservation exit time, display an error message
        if (!updateReservation.matchedCount) {
            return res.status(404).json({
                message: "Reservation not found",
                status: "error"
            })
        }

        //get the reservation details
        doc = await inParkingReservation.findOne({ vehicleNumber: vehicleNumber, status: "Reserved" });

        //create a new payment document to continue the reservation process
        const makePayment = await payment.create({
            paymentID: paymentID,
            paymentMethod: null,
            amount: 0,
            exAmount: 0,
            total: 0,
            status: "Pending",
            rateID: null,
            exRateID: null,
            refundID: null,
            reservationID: doc.reservationID,
            bookingID: null
        })

        //if the update process successfull, send a message in the response
        return res.json({
            message: "Reservation successful",
            status: "success",
            reservation: doc
        })
    }

    //catch the error
    catch (err) {
        res.status(500).json({
            message: err.message,
            status: "error"
        })
    }
}

//export all functions
module.exports = {
    //crud operation functions
    getReservationByID,
    getAllReservations,

    //special controller functions
    createReservation,
    endReservation,
}