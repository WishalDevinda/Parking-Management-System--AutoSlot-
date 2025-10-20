//declaring variables to import model.js files
const Employee = require("../models/employeeModel");
const {
  generateID,
  isValidContactNumber,
  normalizeNumber,
} = require("../utils/helperFunctions");

// <<<------------------------- BASIC CRUD OPERATIONS (EMPLOYEE) ----------------------------->>>

// -----------> CREATE: add a new employee (basic)
const createEmployee = async function (req, res) {
  try {
    // assign request body values to variables
    const name          = req.body?.name?.toString().trim();
    const age           = Number(req.body?.age);
    const contactNumber = req.body?.contactNumber?.toString().trim();
    const NIC           = req.body?.NIC?.toString().trim();
    const emailAddress  = req.body?.emailAddress?.toString().trim().toLowerCase();
    const password      = req.body?.password?.toString().trim();
    const role          = req.body?.role?.toString().trim();

    // basic validation
    if (!name || Number.isNaN(age) || !contactNumber || !NIC || !emailAddress || !password || !role) {
      return res.status(400).json({
        message: "name, age, contactNumber, NIC, emailAddress, password and role are required",
        status: "error",
      });
    }
    if (age < 16) {
      return res.status(400).json({ message: "age must be 16 or above", status: "error" });
    }
    if (!isValidContactNumber(contactNumber)) {
      return res.status(400).json({ message: "Invalid contact number (need 10 digits)", status: "error" });
    }

    // create employee document
    const doc = await Employee.create({
      employeeID: "EMP" + generateID(),
      name,
      age,
      contactNumber: normalizeNumber(contactNumber),
      NIC,
      emailAddress,
      password, // NOTE: hash in production; keeping simple to match your current style
      role,
    });

    return res.status(201).json({
      message: "Employee created successfully",
      employee: doc,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> READ-ONE: get employee by employeeID
const getEmployeeByID = async function (req, res) {
  try {
    // get employeeID from params
    const employeeID = req.params?.id?.toString().trim();
    if (!employeeID) {
      return res.status(400).json({ message: "id is required.", status: "error" });
    }

    // find employee
    const doc = await Employee.findOne({ employeeID });

    if (!doc) {
      return res.status(404).json({ message: "Employee not found", status: "error" });
    }

    return res.json({
      employee: doc,
      message: "Employee was found",
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> READ-ALL: get all employees (latest first)
const getAllEmployees = async function (req, res) {
  try {
    //declaring a variable to get all the employees
    const employeeList = await Employee.find().sort({ _id: -1 });

    //send the list as a response
    return res.json({
      employees: employeeList,
      message: "All Employees Fetched Successfully.",
      status: "success",
    });
  }

  //if fetching process has any issue, send an error message to frontend
  catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> UPDATE: update employee by employeeID (basic whitelist + updateOne)
const updateEmployeeByID = async function (req, res) {
  try {
    // get id
    const employeeID = req.params?.id?.toString().trim();
    if (!employeeID) {
      return res.status(400).json({ message: "id is required.", status: "error" });
    }

    // whitelist updatable fields
    const allowed = [
      "name",
      "age",
      "contactNumber",
      "NIC",
      "emailAddress",
      "password",
      "role",
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
    const result = await Employee.updateOne({ employeeID }, { $set: payload });

    if (!result.matchedCount) {
      return res.status(404).json({ message: "Employee not found", status: "error" });
    }

    // fetch updated
    const updated = await Employee.findOne({ employeeID });

    return res.json({
      message: "Employee updated successfully",
      employee: updated,
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// -----------> DELETE: delete employee by employeeID
const deleteEmployeeByID = async function (req, res) {
  try {
    const employeeID = req.params?.id?.toString().trim();
    if (!employeeID) {
      return res.status(400).json({ message: "id is required.", status: "error" });
    }

    const result = await Employee.deleteOne({ employeeID });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Employee not found", status: "error" });
    }

    return res.json({
      message: "Employee deleted successfully",
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, status: "error" });
  }
};

// export functions
module.exports = {
  createEmployee,
  getEmployeeByID,
  getAllEmployees,
  updateEmployeeByID,
  deleteEmployeeByID,
};
