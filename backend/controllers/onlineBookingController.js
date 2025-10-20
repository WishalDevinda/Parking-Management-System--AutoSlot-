//declare a variable to import the online booking model
const OnlineBooking = require("../models/onlineBookingModel");
const Payment = require("../models/paymentModel");
const ChargingRate = require("../models/chargingRateModel");
const Vehicle = require("../models/vehicleModel");
const Slot = require("../models/slotModel");
const {
    generateID,
    generateDate,
    generateTime,
    isValidContactNumber,
    normalizeNumber,
    calculateDuration,
    calculateReservationPayment
} = require("../utils/helperFunctions");
const { updateSlotByID } = require("./slotController");

//-----------> create a new online booking
const createBooking = async function (req, res) {
    try {
        //assign request body values to variables
        const userName = req.body?.userName?.toString().trim();
        const contactNumber = req.body?.contactNumber?.toString().trim();
        const vehicleNumber = req.body?.vehicleNumber?.toString().trim();
        const vehicleType = req.body?.vehicleType?.toString().trim();
        const slotID = req.body?.slotID?.toString().trim();
        const arrivalTime = req.body?.arrivalTime;
        const departureTime = req.body?.departureTime;
        const driverID = req.body?.driverID?.toString().trim();

        //validate required fields
        if (!userName || !contactNumber || !vehicleNumber || !vehicleType || !slotID || !arrivalTime || !departureTime || !driverID) {
            return res.status(400).json({
                message:
                    "userName, contactNumber, vehicleNumber, vehicleType, slotID, arrivalTime, departureTime, and driverID are required.",
                status: "error",
            });
        }

        //validate contact number format
        if (!isValidContactNumber(contactNumber)) {
            return res.status(400).json({
                message: "Invalid contact number (need 10 digits).",
                status: "error",
            });
        }

        //generate necessary values
        const bookingID = "OBK" + generateID();
        const paymentID = "P" + generateID();
        const date = generateDate();

        //calculate duration (in hours or minutes based on helper)
        const duration = calculateDuration(arrivalTime, departureTime);

        //create booking document
        const bookingDoc = await OnlineBooking.create({
            bookingID: bookingID,
            userName: userName,
            contactNumber: normalizeNumber(contactNumber),
            vehicleNumber: vehicleNumber.toUpperCase(),
            vehicleType: vehicleType,
            date: date,
            arrivalTime: arrivalTime,
            departureTime: departureTime,
            status: "Pending",
            entryTime: null,
            exitTime: null,
            duration: duration,
            extraTime: 0,
            slotID: slotID,
            paymentID: paymentID,
            driverID: driverID,
            vehicleID: null
        });

        //find the chargingRate model doc
        //get the chargingRate
        const chargingRateDoc = await ChargingRate.findOne({ vehicleType: vehicleType });

        //display a error message
        if (!chargingRateDoc) {
            return res.status(404).json({
                message: "Charing rate not found",
                status: "error"
            });
        }

        //payment amount
        const paymentAmount = calculateReservationPayment(duration, chargingRateDoc.rateID);

        //create an empty payment entry (will be updated later)
        await Payment.create({
            paymentID: paymentID,
            paymentMethod: "Not Defined",
            amount: paymentAmount,
            exAmount: 0,
            total: 0,
            status: "Pending",
            rateID: chargingRateDoc.rateID,
            exRateID: null,
            refundID: null,
            reservationID: null,
            bookingID: bookingID,
        });

        //return success response
        return res.status(201).json({
            message: "Awaiting for payment",
            booking: bookingDoc,
            status: "success",
        });
    } catch (err) {
        //handle errors
        return res.status(500).json({
            message: err.message,
            status: "error",
        });
    }
};

//update booking
const updateBooking = async function (req, res) {
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

        //find the online booking doc
        const bookingDoc = await OnlineBooking.findOne({ vehicleNumber: vehicleNumber });

        //validate the bookingDoc
        if (!bookingDoc) {
            return res.status(404).json({
                message: "Booking not found",
                status: "error"
            });
        }

        //booking ID
        let bookingID = bookingDoc.bookingID;

        //calculate entryTime
        const entryTime = generateTime();

        //using an if conditon to check the that the entry time in requested time period
        if (!bookingDoc.arrivalTime <= entryTime) {
            return res.status(404).json({
                message: "Vehicle arrived too early",
                status: "error"
            })
        }

        //generate vehicle ID
        const vehicleID = 'V' + generateID();

        //update the exit time and duration
        let updateBooking = await OnlineBooking.updateOne(
            { bookingID: bookingID, status: "Confirmed" },
            { $set: { entryTime: entryTime, vehicleID: vehicleID } });

        //if failed to update the reservation exit time, display an error message
        if (!updateBooking.matchedCount) {
            return res.status(404).json({
                message: "Booking not found",
                status: "error"
            })
        }

        //find the updated booking doc
        bookingDoc = await OnlineBooking.findOne({ boookingID: bookingDoc.bookingID });

        if (!bookingDoc) {
            return res.status(404).json({
                message: "Booking not found",
                status: "error"
            });
        }

        //create a new vehicle document
        await Vehicle.create({
            vehicleID: vehicleID,
            vehicleNumber: vehicleNumber,
            vehicleType: bookingDoc.vehicleType,
            entryTime: entryTime,
            exitTime: null,
            date: generateDate(),
            status: "In-Parking",
            slotID: bookingDoc.slotID
        })


        //update the exit time and duration
        let updateSlotByID = await Slot.updateOne(
            { slotID: bookingDoc.slotID },
            { $set: { status: "Occupied", vehicleID: vehicleID } });

        //if failed to update the reservation exit time, display an error message
        if (!updateSlotByID.matchedCount) {
            return res.status(404).json({
                message: "Slot not found",
                status: "error"
            })
        }

        //if the update process successfull, send a message in the response
        return res.json({
            message: "Booking Confirmed",
            status: "success",
            booking: bookingDoc
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

//end booking reservation process
const endBooking = async function (req, res) {
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

        //find the online booking doc
        const bookingDoc = await OnlineBooking.findOne({ vehicleNumber: vehicleNumber });

        //validate the bookingDoc
        if (!bookingDoc) {
            return res.status(404).json({
                message: "Booking not found",
                status: "error"
            });
        }

        //booking ID
        let bookingID = bookingDoc.bookingID;

        //calculate entryTime
        const exitTime = generateTime();

        //using an if condition to check the exitTime in the booked time period
        if (!exitTime <= bookingDoc.departureTime) {

            //calculate extra time
            const extraTime = calculateDuration(departureTime, exitTime);

            //update the exit time and extra duration
            let updateBooking = await OnlineBooking.updateOne(
                { bookingID: bookingID, status: "Confirmed" },
                { $set: { exitTime: exitTime, extraTime: extraTime } });
        }

        else {
            //update the exit time and extra duration
            let updateBooking = await OnlineBooking.updateOne(
                { bookingID: bookingID, status: "Confirmed" },
                { $set: { exitTime: exitTime } });
        }

        //if failed to update the reservation exit time, display an error message
        if (!updateBooking.matchedCount) {
            return res.status(404).json({
                message: "Booking not found",
                status: "error"
            })
        }

        //find the updated booking doc
        bookingDoc = await OnlineBooking.findOne({ boookingID: bookingDoc.bookingID });

        if (!bookingDoc) {
            return res.status(404).json({
                message: "Booking not found",
                status: "error"
            });
        }

        //create a new vehicle document
        await Vehicle.create({
            vehicleID: vehicleID,
            vehicleNumber: vehicleNumber,
            vehicleType: bookingDoc.vehicleType,
            entryTime: entryTime,
            exitTime: null,
            date: generateDate(),
            status: "In-Parking",
            slotID: bookingDoc.slotID
        })


        //update the exit time and duration
        let updateSlotByID = await Slot.updateOne(
            { slotID: bookingDoc.slotID },
            { $set: { status: "Occupied", vehicleID: vehicleID } });

        //if failed to update the reservation exit time, display an error message
        if (!updateSlotByID.matchedCount) {
            return res.status(404).json({
                message: "Slot not found",
                status: "error"
            })
        }

        //if the update process successfull, send a message in the response
        return res.json({
            message: "Booking Confirmed",
            status: "success",
            booking: bookingDoc
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

//export function
module.exports = { createBooking };
