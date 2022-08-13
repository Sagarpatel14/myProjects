const mongoose = require('mongoose')

const isValidBody = (body) => {
    if (Object.keys(body).length == 0)
        return true
}

const isValidMobile = (mobile) => {
    if (/^[0]?[6789]\d{9}$/.test(mobile))
        return true
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidPassword = (pw) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/.test(pw))
        return true
}

const isValidEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        return true
}

const isValidName = (name) => {
    if (/^[-a-zA-Z_:,.' ']{1,100}$/.test(name))
        return true
}

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === "null") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (value == null) return false
    return true
}

function isValidPrice(str) {
    return /^[0-9.]+$/.test(str);
}

module.exports = {isValid,isValidName,isValidEmail,isValidPrice,isValidPassword,isValidObjectId,isValidMobile,isValidBody}