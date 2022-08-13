const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const userModel = require('../models/userModel');


//############################################ authentication ##########################################################

const authentication = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ status: false, message: "please give token" })
        }

        let splitToken = token.split(" ")

        //----------------------------- Token Verification -----------------------------//
        jwt.verify(splitToken[1], "myProject", (error, decodedtoken) => {
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

module.exports = {authentication}