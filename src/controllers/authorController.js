
const authorModel = require('../models/authorModel');
const validator = require('validator')
const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if (data.fname != undefined && data.lname != undefined && data.email != undefined && data.password != undefined) {
            let isValid = validator.isEmail(data.email)
            let enumValues = ["Mr", "Mrs", "Miss"]
            if (data.title != undefined && enumValues.includes(data.title) && isValid) {
                let author = await authorModel.create(data)
                res.status(201).send({ data: author })
            }
            else {
                res.status(400).send({ msg: "enter all the fields correctly" })
            }
        }
        else {
            res.status(400).send({ msg: "enter all the details correctly" })
        }
    }
    catch(err){
        res.status(500).send({errror : err.message})
    }
}

module.exports = {createAuthor}
