//create and define the helper functions
//generate ID
const generateID = function () {
    const time = Date.now;
    return time.toString();
}

//generate date
const generateDate = function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return '${year}-${month}-${day}';
}

//generate time
const generateTime = function () {
    const time = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return time;
}

//validate the phone number
const isValidContactNumber = function (number) {
    return String(number).length == 10;
}

//normalize the number
const normalizeNumber = function(number) {
    return String(number).trim();
}

//calculate the duration
const calculateDuration = function(entryTime, exitTime) {
    return exitTime - entryTime;
}

//export the functions
module.exports = { 
    generateID, 
    generateTime, 
    generateDate, 
    isValidContactNumber, 
    normalizeNumber,
    calculateDuration
 };