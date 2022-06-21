const authorModel = require("../models/authorModel");


let createAuthor = async function (req, res) {
    try {
        let Data = req.body;
        let saveData = await authorModel.create(Data);
        res.status(201).send({ msg: saveData })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "SERVER ISSUES", reason: err.message })
    }
}


module.exports.createAuthor = createAuthor;