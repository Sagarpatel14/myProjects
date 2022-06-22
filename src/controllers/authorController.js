const authorModel= require("../models/authorModel")
const blogModel= require("../models/blogModel")

const createAuthor= async function (req, res) {
    let data= req.body
    let savedData= await authorModel.create(data)
    res.send({msg: savedData})
}
const createBlog= async function (req, res) {
    let data= req.body
    let savedData= await blogModel.create(data)
    res.send({msg: savedData})
}


module.exports.createAuthor= createAuthor
module.exports.createBlog= createBlog
