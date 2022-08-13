const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

let { isValid, isValidName, isValidEmail, isValidPrice, isValidPassword, isValidMobile, isValidBody } = require('../validations/validation')


const createUser = async function (req, res) {
    try {
        let body = req.body
        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })
        let { name, email, phone, password } = body

        if (!('name' in body)) return res.status(400).send({ status: false, message: 'Please give name field, it is required' })
        if (!isValid(name)) return res.status(400).send({ status: false, message: 'Please enter your name' })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: 'Please enter your name in valid format' })

        if (!('email' in body)) return res.status(400).send({ status: false, message: 'Please give email field, it is required' })
        if (!isValid(email)) return res.status(400).send({ status: false, message: 'Please enter email' })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter email in valid format' })

        if (!('phone' in body)) return res.status(400).send({ status: false, message: 'Please give phone field, it is required' })
        if (!isValid(phone)) return res.status(400).send({ status: false, message: 'Please enter phone' })
        if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: 'Please enter phone in valid format' })

        if (!('password' in body)) return res.status(400).send({ status: false, message: 'Please give password field, it is required' })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: 'The password should be of 8-15 characters and should contain atleast one Upercase, one Lowercase, one Number and one special character' })

        const salt = await bcrypt.genSalt(10);
        // Hashing and salting the password to provide extra security
        hashedPassword = await bcrypt.hash(password, salt);
        body.password = hashedPassword

        if (await userModel.findOne({ email })) return res.status(409).send({ status: false, message: 'sorry, this email has already been used' })
        if (await userModel.findOne({ phone })) return res.status(409).send({ status: false, message: 'sorry, this phone number has already been used' })

        let saveData = await userModel.create(body)
        res.status(201).send({ status: true, message: 'success', data: saveData })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const userLogin = async function (req, res) {
    try {
        let body = req.body
        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })
        let { email, password } = body

        if (!('email' in body)) return res.status(400).send({ status: false, message: 'Please give email field, it is required' })
        if (!isValid(email)) return res.status(400).send({ status: false, message: 'Please enter email' })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter email in valid format' })

        if (!('password' in body)) return res.status(400).send({ status: false, message: 'Please give password field, it is required' })

        let user = await userModel.findOne({ email });
        if (!user) return res.status(401).send({ Status: false, message: "email is not correct" })

        let passwordMatch = await bcrypt.compare(password, user.password)
        if (passwordMatch == false) return res.status(401).send({ status: false, msg: "incorect password" })
        //**------------------- generating token for user -------------------** //
        let userToken = jwt.sign({ UserId: user._id, name: "Sagar" }, 'myProject', { expiresIn: '86400s' }); // token expires in 24hrs
        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: user._id, token: userToken } });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const createProduct = async function (req, res) {
    try {
        let body = req.body
        let userId = req.params.userId
        let decodedId = req.decodedId
        if(userId !== decodedId ) return res.status(403).send({ status: false, message: 'unauthorised access' })
        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })
        let { name, quantity, price } = body

        if (!('name' in body)) return res.status(400).send({ status: false, message: 'Please give name of product field, it is required' })
        if (!isValid(name)) return res.status(400).send({ status: false, message: 'Please enter name of product' })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: 'Please enter product name in valid format' })

        if (!('quantity' in body)) return res.status(400).send({ status: false, message: 'Please give quantity of product field, it is required' })
        if (!isValid(quantity)) return res.status(400).send({ status: false, message: 'Please enter quantity of product' })
        if (!isValidPrice(quantity)) return res.status(400).send({ status: false, message: 'quantity should be an integer or decimal' })

        if (!('price' in body)) return res.status(400).send({ status: false, message: 'Please give price of one product field, it is required' })
        if (!isValid(price)) return res.status(400).send({ status: false, message: 'Please enter price of one product' })
        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: 'price should be an integer or decimal' })

        body.price = quantity * price
        let str = JSON.stringify(body)
        str = str.replace(/price/g, "amount")
        body = JSON.parse(str)
        //console.log(newBody)

        let saveData = await productModel.create(body)
        res.status(201).send({ status: true, message: 'success', data: saveData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const getProduct = async function (req, res) {
    try {
        let userId = req.params.userId
        let decodedId = req.decodedId
        if(userId !== decodedId ) return res.status(403).send({ status: false, message: 'unauthorised access' })

        let products = await productModel.find().sort({ quantity: -1 }).limit(5)
        res.status(200).send({ status: true, message: 'success', data: products })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getAmount = async function (req, res) {
    try {
        let userId = req.params.userId
        let decodedId = req.decodedId
        if(userId !== decodedId ) return res.status(403).send({ status: false, message: 'unauthorised access' })

        let products = await productModel.find()

        let totalAmount = 0
        for(let i=0; i<products.length; i++){
            totalAmount = products[i].amount + totalAmount
        }
        res.status(200).send({ status: true, message: 'success', totalAmount: totalAmount })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}




module.exports = { createUser, userLogin, createProduct, getProduct, getAmount }