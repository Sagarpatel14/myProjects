const internModel = require("../models/internModel")

let createIntern = async function(req, res){
    try {
        let data = req.body

        if (await internModel.findOne({ email: data.email }))
            return res.status(400).send({ msg: "Email Id already exist" })

        if (await internModel.findOne({ mobile: data.mobile }))
            return res.status(400).send({ msg: "Mobile number already exist" })

        if (!/^\+\d{1,3}-\d{10}$/.test(data.mobile)) {
            return res.status(400).send({ status: false, message: `Please provide the correct format for mobile number` })
        }

        let saveData = await internModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createIntern = createIntern;

