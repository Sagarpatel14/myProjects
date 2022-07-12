const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const { isValid, isValidTitle, isValidName, isValidEmail, isValidMobile, isValidPassword, isValidBody, isValidPincode } = require("../validation/validation")

//—————————————————————————————— createUser ———————————————————————————————————————
const createUser = async function (req, res) {
    try {
        const body = req.body
        const { title, name, phone, email, password, address } = body
        
        if (isValidBody(body)) return res.status(400).send({ status: false, message: "Body Should Not be empty" })
        //——————————————————————————————Required Field validations
        if (!("title" in body)) return res.status(400).send({ status: false, message: "Pls Enter Title Its Required" })
        if (!("name" in body)) return res.status(400).send({ status: false, message: "Pls Enter name Its Required" })
        if (!("phone" in body)) return res.status(400).send({ status: false, message: "Pls Enter Phone Attribute Its Required" })
        if (!("email" in body)) return res.status(400).send({ status: false, message: "Pls Enter Email Its Required" })
        if (!("password" in body)) return res.status(400).send({ status: false, message: "Pls Enter Password Its Required" })

        
        //——————————————————————————————Validations
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title should not be empty" })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "Title Should be Mr, Mrs, Miss" })

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name should not be empty" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Pls Enter Valid First Name" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone No. should not be empty" })
        if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: "Pls Enter Valid Pan India No." })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "Email should not be empty" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Pls Enter Email in Valid Format" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password should not be empty" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Password must be in 8-15 characters long and it should contains 1 Upper 1 lower 1 digit and 1 special character atleast" })

        if("address" in body){
            const { pincode,street,city } = address
            if(typeof address === "string") return res.status(400).send({status:false,message:"Address Should be of object type"})
            if(isValidBody(address)) return res.status(400).send({status:false,message:"Address Should Not Be Empty"})
            if("street" in address){
                if(!isValid(street)) return res.status(400).send({status:false,message:"Dont Left Street Attribute Empty"})}
            if("city" in address){
                if(!isValid(city)) return res.status(400).send({status:false,message:"Dont Left city Attribute Empty"})
                if(!isValidName(city)) return res.status(400).send({status:false,message:"Pls Enter Valid City Name"})}
            if("pincode"in address){
                if(!isValid(pincode)) return res.status(400).send({status:false,message:"Dont Left pincode Attribute Empty"})
                if (!isValidPincode(pincode)) return res.status(400).send({ status: false, message: "Pls Enter Valid PAN Pincode" })}}

        //——————————————————————————————Check unique PhoneNo.
        let checkUniquePhone = await userModel.findOne({ phone: phone })
        if (checkUniquePhone) return res.status(400).send({ status: false, message: "This mobile No. Already Exists, Pls Use Unique Mobile No." })

        //——————————————————————————————Check unique Email.
        let checkUniqueMail = await userModel.findOne({ email: email })
        if (checkUniqueMail) return res.status(400).send({ status: false, message: "This EmailId Already Exists. Pls Use Unique EmailId" })

        let saveddata = await userModel.create(body)
        res.status(201).send({ status: true, Data: saveddata })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//—————————————————————————————— loginUser ———————————————————————————————————————

const loginUser = async function (req, res) {
    try {
        let body = req.body
        const { email, password } = body

        if (isValidBody(body)) return res.status(400).send({status:false, message: "Body Should not be empty" });

        if (!("email" in body)) return res.status(400).send({ status: false, message: "please enter email" });
        if (!("password" in body)) return res.status(400).send({ status: false, message: "please enter password" });

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email should not be empty" })
        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password should not be empty" })

        let user = await userModel.findOne({ email: email, password: password });

        if (!user) return res.status(401).send({ status: false, message: "Please use valid credentials" })

        let token = jwt.sign(
            { userId: user._id.toString(), iat: Math.floor(new Date().getTime() / 1000) },

            "project-3@sss#group61", { expiresIn:"6000s" }
        );
        let decode= jwt.verify(token,"project-3@sss#group61")
        let date=decode.iat
        let time= new Date(date*1000).toString()
        res.status(200).send({ status: true, message: "Successfully loggedin",iat:time, token: token });

    } catch (err) {
        res.status(500).send({ message: "Error", error: err.message })
    }
}



module.exports = { createUser, loginUser };

