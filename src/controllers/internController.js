const internModel = require("../models/internModel")
const collegeModel = require("../models/collegeModel")

// const validator = require('validator')

const isValid = function (val) {
    if (typeof val === "undefined" || val === null) return false
    if (typeof val === "string" && val.trim().length === 0) return false
    return true;
}

// const regexValidator = function(val){
//     let regx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
//     return regx.test(val);
// }


const bodyValidator = function (data) {
    return Object.keys(data).length > 0
}

let createIntern = async function(req, res){
    try {
        let data = req.body
        if (!bodyValidator(data)) return res.status(400).send({ status: false, msg: "please enter body" })
        if (!isValid(data.name)) return res.status(400).send({ status: false, msg: "please enter name correctly" })
        if (!isValid(data.email)) return res.status(400).send({ status: false, msg: "please enter email correctly" })
        if (!isValid(data.mobile)) return res.status(400).send({ status: false, msg: "please enter mobile no. correctly" })
        if (!isValid(data.collegeId)) return res.status(400).send({ status: false, msg: "please enter collegeId correctly" })
        
        let usedEmail = await internModel.findOne({ email: data.email })
        if (usedEmail) return res.status(400).send({ status: false, msg: `${data.email} already registered` })

        if (await internModel.findOne({ mobile: data.mobile }))
            return res.status(400).send({ msg: "Mobile number already exist" })

        if (!/^\+\d{1,3}-\d{10}$/.test(data.mobile)) {
            return res.status(400).send({ status: false, message: `Please provide the correct format(+XX-XXXXXXXXXX) for mobile number` })
        }

        if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

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

