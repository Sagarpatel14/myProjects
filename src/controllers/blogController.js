const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel")

let createBlog = async function (req, res) {
    try {
        let Data = req.body;
        if(Data.title != undefined && Data.body != undefined && Data.authorId != undefined && Data.category != undefined){
            let isValidAuth = await authorModel.findById(Data.authorId)
            if(isValidAuth){
                let saveData = await blogModel.create(Data);
                res.status(201).send({ msg: saveData })
            }
            else{
                res.status(400).send({error : "error in authorid"})
            }
        }
        else{
            res.status(400).send({error : "enter all the field details correctly"})
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "SERVER ISSUES", reason: err.message })
    }
}


module.exports.createBlog = createBlog;