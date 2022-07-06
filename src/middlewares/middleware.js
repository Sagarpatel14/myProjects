const jwt = require("jsonwebtoken")
const userModel = require('../models/userModel')
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
    if(!(await userModel.findById(req.body.userId))) return res.status(400).send({status:false,message:"Pls Enter Valid UserId"})
    if(!(req.body.userId == decodedId)) return res.status(400).send({status:false,message:"You Are Not Authorise to do this"})
    next()

}

module.exports={authe,autho}