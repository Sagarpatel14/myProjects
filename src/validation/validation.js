const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === "null") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    if (value == null) return false
    return true
}
const isValidrating = (rating) => {
    if (typeof rating === "string") return false
    if (rating == null) return false
    return true
}
const isValidratingLength = (rating) => {
    if (!(rating >= 1 && rating <= 5)) return false
    return true
}
const isValidBody = (body) => {
    if (Object.keys(body).length == 0)
        return true
}
const isValidName = (name) => {
    if (/^[-a-zA-Z_:,.' ']{1,100}$/.test(name))
        return true
}
const isValidTName = (name) => {
    let tName = name.trim()
    if (/^[A-Za-z ]+[A-Za-z0-9\u00C0-\u017F-' ]*$/.test(tName))
        return true
}
const isValidExcerpt = (ex) => {
    if (/^[a-zA-Z0-9_ ]*$/.test(ex))
        return true
}
const isValidEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        return true
}
const isValidMobile = (mobile) => {
    if (/^[0]?[6789]\d{9}$/.test(mobile))
        return true
}
const isValidPassword = (pw) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/.test(pw))
        return true
}
const isValidIsbn = (no) => {
    if (/^(?:ISBN(?:-10)?:?●)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-●]){3})[-●0-9X]{13}$)[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9X]$/.test(no))
        {return true}
    else if(/^(?:ISBN(?:-13)?:?●)?(?=[0-9]{13}$|(?=(?:[0-9]+[-●]){4})[-●0-9]{17}$)97[89][-●]?[0-9]{1,5}[-●]?[0-9]+[-●]?[0-9]+[-●]?[0-9]$/.test(no)){
       return true
    }
}
const isValidTitle = (title) => {
    if (title == "Mr" || title == "Mrs" || title == "Miss")
        return true
}
const isValidPincode = (pin) => {
    if (/^[1-9][0-9]{5}$/.test(pin))
        return true
}

const isValidDate = (date) => {
    if (/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(date))
        return true
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

module.exports = { isValid, isValidName, isValidEmail, isValidExcerpt, isValidMobile, isValidPassword, isValidIsbn, isValidBody, isValidTitle, isValidPincode, isValidDate, isValidObjectId, isValidrating, isValidratingLength,isValidTName}
