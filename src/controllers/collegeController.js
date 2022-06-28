const collegeModel = require("../models/collegeModel")

let createCollege = async function (req, res) {
    try {
        let data = req.body
        let saveData = await collegeModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createCollege = createCollege;
