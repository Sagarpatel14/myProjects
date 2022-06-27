const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");



let mid1 = function (req, res, next) {
    try {
        let token = req.headers["x-Api-Key"];
        if (!token) token = req.headers["x-api-key"];

        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "ourFirstProject");
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });

        } else {
            req.token = decodedToken

            next();
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "SRVER SIDE ERROR", errror: err.message })
    }
}



let mid2 = async function (req, res, next) {
    try {
        let decodedToken = req.token
        let blogId = req.params.blogId
        let rqrdAuthorId = await blogModel.findById(blogId).select({authorId : 1, _id:0})
        let authorIdFromBlog = rqrdAuthorId.authorId
        let authorLoggedIn = decodedToken.authorId
        if (authorIdFromBlog != authorLoggedIn) {
            return res.status(403).send({ status: false, msg: 'author logged is not allowed to modify the requested authors data' })
        } else {

            next();
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "SRVER SIDE ERROR", errror: err.message })
    }
}




const mid3 = async function (req, res, next) {
    try {
        let decodedToken = req.token
        let data = req.query
    
        let obj = {isDeleted : false , isPublished : false};

        if (data.authorId) {
            obj.authorId = data.authorId
        }
        if (data.category) {
            obj.category = data.category
        }
        if (data.tags) {
            obj.tags = data.tags
        }
        if (data.subcategory) {
            obj.subcategory = data.subcategory
        }
        if (data.isPublished) {
            obj.isPublished = data.isPublished
        }
        req.findObj = obj

        let authorIdObject = await blogModel.find(obj).select({ authorId: 1, _id: 0 })
        let ids = authorIdObject.map((item)=>{return item.authorId.toString()})
    
        if (authorIdObject.length == 0) {return res.status(400).send({ msg: "no such blog" }) }

        let authorIdInToken = decodedToken.authorId

            if ((ids.includes(authorIdInToken))) { next()  }
            
          else{  return res.status(403).send({ status: false, msg: 'User logged is not allowed to delete the requested users data' })}

        }
    
    catch (err) {
      return  res.status(500).send({ msg: "Error", error: err.message})
    }
}




const mid4 = async function (req, res, next) {
    try {
        let decodedToken = req.token
        let authorIdInBody = req.body.authorId

        let isValidAuth = await authorModel.findById(authorIdInBody)
        if (isValidAuth === null) return res.status(400).send({ status: false, msg: "please enter correct authorid" })

        let authorIdInToken = decodedToken.authorId
        if (authorIdInBody != authorIdInToken) { return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' }) }
        next()
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}








module.exports.mid1 = mid1
module.exports.mid2 = mid2
module.exports.mid3 = mid3
module.exports.mid4 = mid4