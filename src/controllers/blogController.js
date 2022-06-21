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

const updatedBlogs = async function(req , res){
    try{
        let {title , body , tags , subcategory} = req.body
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId);
        if(blog  && blog.isDeleted === false){
            if(title){
                blog.title = title
            }
            if(body){
                blog.body = body
            }
            if(tags){
                blog.tags.push(tags)
            
            }
            if(subcategory){
                blog.subcategory.push(subcategory)
                
            }
            blog.isPublished = true
            blog.save()
            res.status(200).send({status: true , data: blog})
        }
        else{
            res.status(404).send({status: false , msg: "data not found or deleted"})
        }
    }
    catch(err){
        res.status(500).send({error : err.message})
    }

}


const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId)
        if (blog) {
            if (!blog.isDeleted) {
                blog.isDeleted = true
                blog.save()
                res.status(200)
            }
        }
        else {
            res.status(404).send({ status: flase, msg: "" })
        }
    }
    catch(err){
        res.status(500).send({msg : err.message})
    }
    
}

const deleteBlogByparam = async function(req , res){
    try{
        let category = req.query
        let blogs = await blogModel.find(category)
        if(blogs.length > 0){
            let blogIds = blogs.map(e => e._id)
            let updatedBlogs = blogModel.updateMany({_id : {$in : blogIds}}, {isDeleted : true})
            res.status(200)
        }
        else{
            res.status(404).send({status : false , msg: ""})
        }
        
    }
    catch(err){
        res.status(500).send({msg : err.message})
    }
}


module.exports.createBlog = createBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByparam = deleteBlogByparam;
module.exports.updatedBlogs = updatedBlogs;