const internModel = require("../models/internModel")
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

let createIntern = async function(req, res){
    try {
        let data = req.body
        if (!bodyValidator(data)) return res.status(400).send({ status: false, msg: "please enter body" })
        if (!isValid(data.email)) return res.status(400).send({ status: false, msg: "please enter email correctly" })
        if (!isValid(data.mobile)) return res.status(400).send({ status: false, msg: "please enter mobile no. correctly" })
        if (!isValid(data.collegeId)) return res.status(400).send({ status: false, msg: "please enter collegeId correctly" })

        let isValidCollege = await collegeModel.findById(data.collegeId)
        if (isValidCollege === null) res.status(400).send({ status: false, msg: "please enter correct collegeId" })

        let saveData = await internModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createIntern = createIntern;

