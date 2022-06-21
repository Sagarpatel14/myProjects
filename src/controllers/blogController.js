const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel")

let createBlog = async function (req, res) {
    try {
        let Data = req.body;
        if (Data.title != undefined && Data.body != undefined && Data.authorId != undefined && Data.category != undefined) {
            let isValidAuth = await authorModel.findById(Data.authorId)
            if (isValidAuth) {
                let saveData = await blogModel.create(Data);
                res.status(201).send({ msg: saveData })
            }
            else {
                res.status(400).send({ error: "error in authorid" })
            }
        }
        else {
            res.status(400).send({ error: "enter all the field details correctly" })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "SERVER ISSUES", reason: err.message })
    }
}

let updateBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let blog = await blogModel.findById(blogId)
        if(!blog) return res.status(404).send({status: false, msg: 'No such blog exists'}) 
        let Data = req.body;
        let updated = await blogModel.findOneAndUpdate(
            {_id : blog._id}, Data,{new : true})
            // {$set: { title : Data.title,
            //     body : Data.body
            // }},
           
                    
            // {$push :{tags : Data.tags,
            //     subcategory : Data.subcategory
            // }},
            // ;
        res.status(200).send({status : true, msg: updated })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "SERVER ISSUES", reason: err.message })
    }
}



module.exports.createBlog = createBlog;
module.exports.updateBlog = updateBlog;
