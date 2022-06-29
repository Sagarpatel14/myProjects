const collegeModel = require("../models/collegeModel")
const validator = require('validator')

const isValid = function (val) {
    if (typeof val === "undefined" || val === null) return false
    if (typeof val === "string" && val.trim().length === 0) return false
    return true;
}

const regexValidator = function(val){
    let regx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
    return regx.test(val);
}


const bodyValidator = function (data) {
    return Object.keys(data).length > 0
}

let createCollege = async function (req, res) {
    try {
        let data = req.body
        if (!bodyValidator(data)) return res.status(400).send({ status: false, msg: "please enter body" })
        if (!isValid(data.name)) return res.status(400).send({ status: false, msg: "please enter name correctly" })
        if (!isValid(data.fullName)) return res.status(400).send({ status: false, msg: "please enter full name correctly" })
        if (!isValid(data.name)) return res.status(400).send({ status: false, msg: "please enter logo link correctly" })

        let saveData = await collegeModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createCollege = createCollege;
