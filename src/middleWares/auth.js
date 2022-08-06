const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const userModel = require('../models/userModel');
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


//############################################ authentication ##########################################################

const authentication = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ status: false, message: "please give token" })
        }

        let splitToken = token.split(" ")

        //----------------------------- Token Verification -----------------------------//
        jwt.verify(splitToken[1], "FunctionUp Group30", (error, decodedtoken) => {
            if (error) {
                const message =
                    error.message === "jwt expired" ? "Token is expired, Please login again" : "Token is invalid, Please recheck your Token"
                return res.status(401).send({ status: false, message:message })
            }
            //console.log(decodedtoken)
            req.decodedId = decodedtoken.UserId
            next();
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//############################################ authorization ####################################################/

let authorization = async function (req, res, next) {
    try {
        let userId = req.params.userId;

        //validation for given userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Please enter valid userId" })
        }

        //----------------------------- Checking if User exist or not -----------------------------//
        let user = await userModel.findOne({ _id: userId })
        if (!user) {
            return res.status(404).send({ status: false, message: "User does not exist with this userId" })
        }

        //----------------------------- Authorisation checking -----------------------------//
        //console.log(req.decodedId);
        //console.log(userId);
        if (req.decodedId != userId) {
            return res.status(403).send({ status: false, message: "Unauthorised access" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { authentication, authorization }