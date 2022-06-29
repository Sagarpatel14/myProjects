const collegeModel = require("../models/collegeModel")

let createCollege = async function (req, res) {
    try {
        let data = req.body

        if (await collegeModel.findOne({ name: data.name }))
        return res.status(400).send({ msg: "College name already exist" })

        if (await collegeModel.findOne({ fullName: data.fullName }))
        return res.status(400).send({ msg: "College fullName already exist" })

        if (await collegeModel.findOne({ logoLink: data.logoLink }))
        return res.status(400).send({ msg: "logoLink already exist" })
        

        let saveData = await collegeModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createCollege = createCollege;
