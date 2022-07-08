const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const { isValid, isValidTitle, isValidName, isValidEmail, isValidMobile, isValidPassword, isValidBody, isValidPincode } = require("../validation/validation")

const createUser = async function (req, res) {
    try {
        const body = req.body
        const { title, name, phone, email, password, address } = body
        const { pincode } = address

        if (isValidBody(body)) return res.status(400).send({ status: false, message: "Body Should Not be empty" })
        if (!("title" in body)) return res.status(400).send({ status: false, message: "Pls Enter Title Its Required" })
        if (!("name" in body)) return res.status(400).send({ status: false, message: "Pls Enter name Its Required" })
        if (!("phone" in body)) return res.status(400).send({ status: false, message: "Pls Enter Phone Attribute Its Required" })
        if (!("email" in body)) return res.status(400).send({ status: false, message: "Pls Enter Email Its Required" })
        if (!("password" in body)) return res.status(400).send({ status: false, message: "Pls Enter Password Its Required" })

        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title should not be empty" })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "Title Should be Mr,Mrs,Miss" })

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name should not be empty" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: "Pls Enter Valid First Name" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone No. should not be empty" })
        if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: "Pls Enter Valid Pan India No." })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "Email should not be empty" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Pls Enter Email in Valid Format" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password should not be empty" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Password must be in 8-15 characters long and it contains 1 Upper 1 lower 1 digit and 1 special character atleast" })

        if (!isValidPincode(pincode)) return res.status(400).send({ status: false, message: "Pls Enter Valid PAN Pincode" })

        let checkUniquePhone = await userModel.findOne({ phone: phone })
        if (checkUniquePhone) return res.status(400).send({ status: false, message: "This No. Already Exists. Pls Use Unique Mobile No." })

        let checkUniqueMail = await userModel.findOne({ email: email })
        if (checkUniqueMail) return res.status(400).send({ status: false, message: "This EmailId Already Exists. Pls Use Unique EmailId" })

        let saveddata = await userModel.create(body)
        res.status(201).send({ status: true, Data: saveddata })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const loginUser = async function (req, res) {
    try {
        let body = req.body
        const { email, password } = body

        if (isValidBody(body)) return res.status(400).send({ message: "Body Should not be empty" });

        if (!("email" in body)) return res.status(400).send({ status: false, message: "please enter email" });
        if (!("password" in body)) return res.status(400).send({ status: false, message: "please enter password" });

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email should not be empty" })
        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password should not be empty" })

        let user = await userModel.findOne({ email: email, password: password });

        if (!user) return res.status(400).send({ status: false, message: "Please use valid credentials" })

        let token = jwt.sign(
            { userId: user._id.toString(), password: user.password, iat: Math.floor(new Date().getTime() / 1000) },

            "project-3@sss#group61", { expiresIn: "120s" }
        );

        res.status(200).send({ status: true, message: "Successfully loggedin", token: token });

    } catch (err) {

        console.log("This is the error:", err)
        res.status(500).send({ message: "Error", error: err.message })
    }

}



module.exports = { createUser, loginUser };

