
const authorModel = require('../models/authorModel');
const validator = require('validator')
const jwt = require("jsonwebtoken")
const { isValidTName, isValid, isValidDate, isValidObjectId, isValidBody, isValidName,isValidTitle } = require('../validations/validation')

//——————————————————————————————creatAuthor——————————————————————————————————————————————————————————————————

const createAuthor = async function (req, res) {
    try {
        let body = req.body
        let {fname,lname,title,email,password} = body
        
        //——————————————————————————————Required Field validations——————————————————————————
        if(!("fname" in body )) return res.status(400).send({status:false,message : 'Pls enter fname, it is required'})
        if(!("lname" in body )) return res.status(400).send({status:false,message : 'Pls enter lname, it is required'})
        if(!("email" in body )) return res.status(400).send({status:false,message : 'Pls enter email, it is required'})
        if(!("password" in body )) return res.status(400).send({status:false,message : 'Pls enter password, it is required'})

        //——————————————————————————————validations——————————————————————————
        if (isValidBody(body)) return res.status(400).send({ status: false, msg: "please enter body" })

        if (!isValid(fname)) return res.status(400).send({ status: false, msg: "please do not leave fname empty" })
        if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "please enter fname in correct format" })

        if (!isValid(lname)) return res.status(400).send({ status: false, msg: "please do not leave lname empty" })
        if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "please enter lname in correct format" })

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "please do not leave title empty" })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: "title can only be Mr, Mrs, and Miss" })

        if (!isValid(email)) return res.status(400).send({ status: false, msg: "please do not leave email empty" })
        if (!(validator.isEmail(email))) return res.status(400).send({ status: false, msg: "please enter a valid email" })

        if (!isValid(password)) return res.status(400).send({ status: false, msg: "please do not leave password empty" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: "Password must be of 8-15 characters and should contains atleast 1 UpperCase, 1 lowerCase, 1 numeric value and 1 special character " })

        //——————————————————————————————unique field validations——————————————————————————
        let usedEmail = await authorModel.findOne({ email: email })
        if (usedEmail) return res.status(400).send({ status: false, msg: `${email} already registered` })

        let author = await authorModel.create(body)
        res.status(201).send({ status: true, msg: " author created successfully", data: author })
    }
    catch (err) {
        res.status(500).send({ status:false, errror: err.message })
    }
}





const loginAuthor = async function (req, res) {
    try {
        let body = req.body;
        let{userName,password} = body;
        if (isValidBody(data)) return res.status(400).send({ status: false, msg: "please enter body" })
        
        if(!("userName" in body )) return res.status(400).send({status:false,message : 'Pls enter userName, it is required'})
        if(!("password" in body )) return res.status(400).send({status:false,message : 'Pls enter password, it is required'})

        if (!isValid(userName)) return res.status(400).send({ status: false, msg: "please do not leave userName empty" })
        if (!isValid(password)) return res.status(400).send({ status: false, msg: "please do not password empty" })

        let author = await authorModel.findOne({ email: userName, password: password });
        if (!author) return res.status(401).send({ status: false, msg: "username or password is not correct" });

        let token = jwt.sign(
            {
                authorId: author._id.toString(),
                batch: "Radon",
                organisation: "FunctionUp",
            },
            "ourFirstProject"
        );
        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, token: token });
    }
    catch (err) {
        res.status(500).send({ status : false, msg : "SRVER SIDE ERROR", errror: err.message })
    }
}



module.exports = {createAuthor,loginAuthor }

