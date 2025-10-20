//declaring variables to import model.js files
const Payment = require("../models/paymentModel");
const InParkingReservation = require("../models/inParkingReservationModel");
const Vehicle = require("../models/vehicleModel");
const OnlineBooking = require("../models/onlineBookingModel");
const {
  generateID,
  generateDate
} = require("../utils/helperFunctions");

// <<<------------------------- BASIC CRUD OPERATIONS (PAYMENT) ----------------------------->>>

// -----------> CREATE: add a new payment (basic)
const createPayment = async function (req, res) {
  try {
    // assign request body values to variables
    const paymentMethod = req.body?.paymentMethod?.toString().trim() || "Not Defined";
    const amount = Number(req.body?.amount ?? 0);
    const exAmount = Number(req.body?.exAmount ?? 0);
    const total = Number(req.body?.total ?? amount + exAmount);
    const status = req.body?.status?.toString().trim() || "Pending";
    const rateID = req.body?.rateID?.toString().trim() || "Not Defined";
    const exRateID = req.body?.exRateID ?? null;
    const refundID = req.body?.refundID ?? null;
    const reservationID = req.body?.reservationID ?? null; // for in-parking or on-exit payments
    const bookingID = req.body?.bookingID ?? null;     // for online booking payments

    // basic validation
    if (Number.isNaN(amount) || Number.isNaN(exAmount) || Number.isNaN(total)) {
      return res.status(400).json({ message: "amount/exAmount/total must be numbers", status: "error" });
    }

    // create payment document
    const doc = await Payment.create({
      paymentID: "P" + generateID(),
      paymentMethod,
      amount,
      exAmount,
      total,
      status,       // e.g., Pending | Paid | Refunded | Cancelled
      rateID,
      exRateID,
      refundID,
      reservationID,
      bookingID,
    });

    return res.status(201).json({
      message: "Payment created successfully",
      payment: doc,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> READ-ONE: get payment by paymentID
const getPaymentByID = async function (req, res) {
  try {
    // get paymentID from params
    const paymentID = req.params?.id?.toString().trim();

    if (!paymentID) {
      return res.status(400).json({ message: "id is required.", status: "error" });
    }

    // find payment
    const doc = await Payment.findOne({ paymentID });

    if (!doc) {
      return res.status(404).json({ message: "Payment not found", status: "error" });
    }

    return res.json({
      payment: doc,
      message: "Payment was found",
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> READ-ALL: list all payments (latest first) with optional filters
// -----------> get all payments
const getAllPayments = async function (req, res) {
  try {
    //declaring a variable to get all the payments
    const paymentList = await Payment.find().sort({ _id: -1 });

    //send the payment list as a response
    return res.json({
      payments: paymentList,
      message: "All Payments Fetched Successfully.",
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


// -----------> UPDATE: update payment by paymentID (basic whitelist + updateOne)
const updatePaymentByID = async function (req, res) {
  try {
    // get id
    const paymentID = req.params?.id?.toString().trim();
    if (!paymentID) {
      return res.status(400).json({ message: "id is required.", status: "error" });
    }

    // whitelist updatable fields
    const allowed = [
      "paymentMethod",
      "amount",
      "exAmount",
      "total",
      "status",
      "rateID",
      "exRateID",
      "refundID",
      "reservationID",
      "bookingID",
    ];

    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        payload[key] = req.body[key];
      }
    }

    // numeric checks if present
    if (payload.amount !== undefined && Number.isNaN(Number(payload.amount))) {
      return res.status(400).json({ message: "amount must be a number", status: "error" });
    }
    if (payload.exAmount !== undefined && Number.isNaN(Number(payload.exAmount))) {
      return res.status(400).json({ message: "exAmount must be a number", status: "error" });
    }
    if (payload.total !== undefined && Number.isNaN(Number(payload.total))) {
      return res.status(400).json({ message: "total must be a number", status: "error" });
    }

    // perform update
    const result = await Payment.updateOne({ paymentID }, { $set: payload });

    if (!result.matchedCount) {
      return res.status(404).json({ message: "Payment not found", status: "error" });
    }

    // fetch updated
    const updated = await Payment.findOne({ paymentID });

    return res.json({
      message: "Payment updated successfully",
      payment: updated,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> DELETE: delete payment by paymentID
const deletePaymentByID = async function (req, res) {
  try {
    const paymentID = req.params?.id?.toString().trim();
    if (!paymentID) {
      return res.status(400).json({ message: "id is required.", status: "error" });
    }

    const result = await Payment.deleteOne({ paymentID });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Payment not found", status: "error" });
    }

    return res.json({
      message: "Payment deleted successfully",
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// <<<------------------------ Special Controller Functions ------------------------>>>
const updateReservationPaymentByID = async function (req, res) {
  try {
    //declaring variablea to assign body values
    const paymentID = req.body?.paymentID?.toString().trim().toUpperCase();
    const paymentMethod = req.body?.paymentMethod?.toString().trim();


    //display an error message if the id doesn't exist in the parameter
    if (!paymentID || !paymentMethod) {
      return res.status(400).json({
        message: "Payemnt ID and payment method are required",
        status: "error"
      });
    }

    //update the exit time and duration
    const updatePayment = await Payment.updateOne(
      { paymentID: paymentID, status: "Pending" },
      { $set: { status: "Paid", date: generateDate() } });

    //if failed to update the payment doc, display an error message
    if (!updatePayment.matchedCount) {
      return res.status(404).json({
        message: "Payment not found",
        status: "error"
      })
    }

    //find the entryTime of the reservation
    let paymentDoc = await Payment.findOne({ paymentID: paymentID, status: "Paid" });

    //if the document was not found
    if (!paymentDoc) {
      return res.status(404).json({ message: "Payment not found", status: "error" });
    }

    //get the reservation doc
    const reservationDoc = await InParkingReservation.findOne({ paymentID: paymentID });

    //using an if condition to check the availability of the reservation doc
    if (!reservationDoc) {
      return res.status(404).json({ message: "Reservation not found", status: "error" });
    }

    //update the reservation
    const updateReservation = await InParkingReservation.updateOne(
      { reservationID: reservationDoc.reservationID },
      { $set: { status: "Completed" } }
    )

    //check the update
    if (!updateReservation.matchedCount) {
      return res.status(404).json({
        message: "Reservation not found",
        status: "error"
      })
    }

    //udpate the  vehicle doc
    const updateVehicle = await Vehicle.updateOne(
      { vehicleID: reservationDoc.vehicleID },
      {$set: { status: "Completed"}}
    )

        //check the update
    if (!updateVehicle.matchedCount) {
      return res.status(404).json({
        message: "Vehicle not found",
        status: "error"
      })
    }

    //if the payment process successfull, send a message in the response
    return res.json({
      message: "Payment successful",
      status: "success",
      payment: paymentDoc
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

const updateBookingPaymentByID = async function (req, res) {
  try {
    //declaring variablea to assign body values
    const paymentID = req.body?.paymentID?.toString().trim().toUpperCase();
    const paymentMethod = req.body?.paymentMethod?.toString().trim();


    //display an error message if the id doesn't exist in the parameter
    if (!paymentID || !paymentMethod) {
      return res.status(400).json({
        message: "Payement ID and payment method are required",
        status: "error"
      });
    }

    //update the exit time and duration
    const updatePayment = await Payment.updateOne(
      { paymentID: paymentID, status: "Pending" },
      { $set: { status: "Paid", date: generateDate() } });

    //if failed to update the payment doc, display an error message
    if (!updatePayment.matchedCount) {
      return res.status(404).json({
        message: "Payment not found",
        status: "error"
      })
    }

    //find the entryTime of the reservation
    let paymentDoc = await Payment.findOne({ paymentID: paymentID, status: "Paid" });

    //if the document was not found
    if (!paymentDoc) {
      return res.status(404).json({ message: "Payment not found", status: "error" });
    }

    //get the booking doc
    const bookingDoc = await OnlineBooking.findOne({ paymentID: paymentID });

    //using an if condition to check the availability of the booking doc
    if (!bookingDoc) {
      return res.status(404).json({ message: "Booking not found", status: "error" });
    }

    //update the booking
    const updateBooking = await OnlineBooking.updateOne(
      { paymentID: paymentID },
      { $set: { status: "Confirmed" } }
    )

    //check the update
    if (!updateBooking.matchedCount) {
      return res.status(404).json({
        message: "Booking not found",
        status: "error"
      })
    }

    //if the payment process successfull, send a message in the response
    return res.json({
      message: "Payment & booking successful",
      status: "success",
      payment: paymentDoc,
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

// export functions
module.exports = {
  createPayment,
  getPaymentByID,
  getAllPayments,
  updatePaymentByID,
  deletePaymentByID,
  updateReservationPaymentByID,
  updateBookingPaymentByID
};
