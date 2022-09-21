
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel")
const { isValidTName, isValid, isValidObjectId, isValidBody, isValidName } = require('../validations/validation')


let createBlog = async function (req, res) {
    try {
        let data = req.body;
        let {title,body,authorId,category} = data;

        if (isValidBody(data)) return res.status(400).send({ status: false, msg: "please enter body" })

        if(!("title" in data )) return res.status(400).send({status:false,message : 'Pls enter title, it is required'})
        if(!("body" in data )) return res.status(400).send({status:false,message : 'Pls enter body, it is required'})
        if(!("authorId" in data )) return res.status(400).send({status:false,message : 'Pls enter authorId, it is required'})
        if(!("category" in data )) return res.status(400).send({status:false,message : 'Pls enter category, it is required'})

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "please do not leave title empty" })
        if (!isValidName(title)) return res.status(400).send({ status: false, msg: "please enter title in correct format" })

        if (!isValid(body)) return res.status(400).send({ status: false, msg: "please do not leave body empty" })
        if (!isValidTName(body)) return res.status(400).send({ status: false, msg: "please enter body in correct format" })

        if (!isValid(authorId)) return res.status(400).send({ status: false, msg: "please do not leave authorId empty" })
        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, msg: "please enter authorId in valid format" })

        if (!isValid(category)) return res.status(400).send({ status: false, msg: "please do not leave category empty" })
        if (!isValidTName(category)) return res.status(400).send({ status: false, msg: "please enter category in valid format" })

        let isValidAuth = await authorModel.findById(authorId)
        if (isValidAuth === null) res.status(400).send({ status: false, msg: "please enter correct authorid" })

        let blog = await blogModel.create(data)
        res.status(201).send({ status: true, msg: "blog created successfully" })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "SERVER ISSUES", reason: err.message })
    }
}




const getBlogs = async function (req, res) {
    try {
        let query = req.query
        let {authorId,category,tags,subcategory} = query

        if (!isValidObjectId(authorId)) return res.status(400).send({ status: false, msg: "please enter authorId in valid format" })

        let obj = {
            isDeleted: false,
            isPublished: true
        }

        if (authorId) {
            obj.authorId = authorId
        }
        if (category) {
            obj.category = category
        }
        if (tags) {
            obj.tags = tags
        }
        if (subcategory) {
            obj.subcategory = subcategory
        }

        let savedData = await blogModel.find(obj)
        if (savedData.length == 0) {
            return res.status(400).send({ status: false, msg: "No such Blogs Available" })
        } else {
            return res.status(200).send({ msg: savedData })
        }
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}




const updatedBlogs = async function (req, res) {
    try {
        let { title, body, tags, subcategory } = req.body
        if(!bodyValidator(req.body)) return res.status(400).send({status: false , msg: "please enter body"})
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId);
        if (blog && blog.isDeleted === false) {
            if (isValid(title)) {
                blog.title = title
            }
            if (isValid(body)) {
                blog.body = body
            }
            if (isValid(tags)) {
                if (typeof tags == 'object') {
                    for (let i of tags) {
                        blog.tags.push(i)
                    }
                } else { blog.tags.push(tags) }
            }
            if (isValid(subcategory)) {
                if (typeof subcategory == 'object') {
                    for (let i of subcategory) {
                        blog.subcategory.push(i)
                    }
                } else { blog.subcategory.push(subcategory) }
            }

            blog.isPublished = true
            let date = new Date();
            blog.publishedAt = date
            blog.save()
            res.status(200).send({ status: true, data: blog })
        }
        else {
            res.status(404).send({ status: false, msg: "data not found or deleted" })
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}




const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        let blog = await blogModel.findById(blogId)
        if (blog) {
            if (blog.isDeleted == false) {
                blog.isDeleted = true
                let date = new Date();
                blog.deletedAt = date
                blog.save()
                res.status(200).send({ status: true, })
            } else {
                res.status(404).send({ msg: "already deleted" })
            }
        }
        else {
            res.status(404).send({ status: flase, msg: "blog dosen't exist" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }

}



const deleteBlogByQuery = async function (req, res) {
    try {
        let obj = req.findObj
        let decodedToken = req.token

        obj.authorId = decodedToken.authorId

        let blogs = await blogModel.find(obj)
        if (blogs.length > 0) {
            let deletedBlogs = await blogModel.updateMany(obj, { $set: { isDeleted: true, deletedAt : new Date()} })
            res.status(200).send({ status: true })
        }
        else {
            res.status(404).send({ status: false, msg: "no such blog available" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}



module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs
module.exports.updatedBlogs = updatedBlogs;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;
