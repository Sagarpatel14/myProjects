const internModel = require("../models/internModel")

let createIntern = async function(req, res){
    try {
        let data = req.body
        let saveData = await internModel.create(data)
        res.status(201).send({ status: true, data: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.createIntern = createIntern;

