const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const validator = require('validator')

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
// const queryValidator = function (query) {
//     return Object.keys(query).length > 0
// }

let createCollege = async function (req, res) {
    try {
        let data = req.body
        let { name, fullName, logoLink } = data
        if (!bodyValidator(data)) return res.status(400).send({ status: false, message: "please enter body" })
        if (!isValid(name)) return res.status(400).send({ status: false, message: "please enter name correctly" })
        if (!isValid(fullName)) return res.status(400).send({ status: false, message: "please enter full name correctly" })
        if (!isValid(logoLink)) return res.status(400).send({ status: false, message: "please enter logo link correctly" })

        if (await collegeModel.findOne({ name: data.name }))
            return res.status(400).send({ msg: "College name already exist" })

        if (await collegeModel.findOne({ fullName: data.fullName }))
            return res.status(400).send({ msg: "College fullName already exist" })

        if (await collegeModel.findOne({ logoLink: data.logoLink }))
            return res.status(400).send({ msg: "logoLink already exist" })

        if (!/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g.test(data.logoLink)) {
            return res.status(400).send({ status: false, message: `please enter a valid URL` });
        }

        let lowerCasedname = name.toLowerCase()
        data.name = lowerCasedname


        let collegeDetails = await collegeModel.create(data)

        let college = {
            "name": collegeDetails.name,
            "fullName": collegeDetails.fullName,
            "logoLink": collegeDetails.logoLink,
            "isDeleted": collegeDetails.isDeleted
        }
        return res.status(201).send({ status: true, data: college })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}




let getCollegeDetails = async function (req, res) {
    try {
        let clgName = req.query.collegeName;
        if (!isValid(clgName)) return res.status(400).send({ status: false, message: "please give an abbreviated college name" })
        let collegeName = clgName.toLowerCase()

        let college = await collegeModel.findOne({ name: collegeName })
        if (!college) return res.status(404).send({ status: false, message: "no such document available" })

        let interns = await internModel.find({ collegeId: college._id }).select({ name: 1, email: 1, mobile: 1 });
        if(interns.length == 0) return res.status(404).send({status : false, message : "no interns found in this college"})

        let collegeAndItsInterns = {
            "name": college.name,
            "fullName": college.fullName,
            "logoLink": college.logoLink,
            "interns": interns
        }
        return res.status(200).send({ status: true, data: collegeAndItsInterns })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}



module.exports.createCollege = createCollege;
module.exports.getCollegeDetails = getCollegeDetails;
