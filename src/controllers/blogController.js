const { TransformStreamDefaultController } = require("stream/web")
const blogModel = require("../models/blogModel")

// const getB = async function (req, res) {
//     let authorId = req.query.authorId
//     let category = req.query.category
//     let tag = req.query.tag
//     let subcategory = req.query.subcategory
//     let savedData = await blogModel.find({ $and: [{ $and: [{ isDeleted: false }, { isPublished: false }] }, { $or: [{ authorId: authorId }, { category: category }, { tag: tag }, { subcategory: subcategory }] }] })
//     if (savedData.length == 0) {
//         return res.send({ status: true, msg: "No such Blogs Available" })
//     } else {
//         return res.send({ msg: savedData })
//     }
// }
const getBlogs = async function (req, res) {
 try {  let authorId = req.query.authorId
    let category = req.query.category
    let tags = req.query.tags
    let subcategory = req.query.subcategory

    let obj = {
        isDeleted: false,
        isPublished: false
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
        return res.status(400).send({ status: true, msg: "No such Blogs Available" })
    } else {
        return res.status(200).send({ msg: savedData })
    } }catch(err){
        res.status(500).send({ msg: err.message })
    }
}
module.exports.getBlogs = getBlogs