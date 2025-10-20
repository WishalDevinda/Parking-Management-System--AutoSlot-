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

    return '${year}.${month}.${day}';
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
// -----------> calculateDuration (in minutes between entry & exit)
const calculateDuration = function (entryTime, exitTime) {
    // Parse both times as "today" in UTC base
    const entry = new Date(`1970-01-01T${entryTime}Z`);
    const exit = new Date(`1970-01-01T${exitTime}Z`);

    // If exit is earlier (like crossing midnight), add 24 hours
    if (exit < entry) {
        exit.setTime(exit.getTime() + 24 * 60 * 60 * 1000);
    }

    // Calculate difference (in milliseconds)
    const diffMs = exit - entry;

    // Convert to minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    return diffMinutes; // returns total minutes
};

//format the duration to HH:MM
const formatDuration = function (minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

//calculate the payment payment amount
const calculateReservationPayment = function(duration, rate) {
    const paymentAmount = (duration / 60) * rate;
    return paymentAmount.toFixed(2);
}


//export the functions
module.exports = { 
    generateID, 
    generateTime, 
    generateDate, 
    isValidContactNumber, 
    normalizeNumber,
    calculateDuration,
    formatDuration,
    calculateReservationPayment
 };