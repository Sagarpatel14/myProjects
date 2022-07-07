const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
const mongoose=require("mongoose")
const authe = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) req.headers["X-Api-Key"]
        if (!token) return res.status(400).send({ status: false, message: "Token must be present in header" })
        try {
            let decodeToken = jwt.verify(token, "project-3@sss#group61")
            if (!decodeToken) return res.status(400).send({ status: false, message: "Token invalid" })
        }
        catch (err) {
            return res.status(401).send({ status: false, message: "Token Is Expired Now Pls Regenerate it" })
        }
        next();
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const autho= async function(req,res,next){
    let token = req.headers["x-api-key"]
    if (!token) req.headers["X-Api-Key"]
    if (!token) res.status(400).send({ status: false, message: "Token must be present in header" })
    let decodeToken = jwt.verify(token, "project-3@sss#group61")
    if (!decodeToken) return res.status(400).send({ status: false, message: "Token invalid" })
    let decodedId= decodeToken.userId
    if(!(req.params.bookId)){
    if(!("userId" in req.body)) return res.status(400).send({status:false,message:"Pls Enter userId Of User at Which you want to create book"})
    if(req.body.userId.trim().length==0) return res.status(400).send({status:false,message:"Dont Left UserId Empty"})
    if(!(mongoose.isValidObjectId(req.body.userId))) return res.status(400).send({status:false,message:"Pls enter UserId in Valid Format"})
    if(!(await userModel.findById(req.body.userId))) return res.status(400).send({status:false,message:"This Id Doesnot Exists"})
    if(!(req.body.userId == decodedId)) return res.status(400).send({status:false,message:"You Are Not Authorise to do this"})
   
    }
    else{

    }
    next()

}

module.exports={authe,autho}