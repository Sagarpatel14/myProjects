const userModel = require('../models/userModel') // require userModel
const { uploadFile } = require('../validation/aws')// require aws 
const bcrypt = require('bcrypt');//require password bcrypt
const axios = require("axios");

//<===========require Validation and destructing==============================================>
const { isImageFile,isValid, isValidName, isValidEmail, isValidMobile, isValidPassword, isValidBody, isValidTitle, isValidPincode, isValidDate, isValidObjectId, isValidrating, isValidratingLength, isValidTName, isValidAddress } = require('../validation/valid')

//<==================================user Create =======================================>
const createUser = async function (req, res) {
    try {
        const body = req.body
        let files = req.files
        // console.log(files)
        // console.log(body)
        //<================================body Check =============================================>
        if (isValidBody(body)) return res.status(400).send({ status: false, message: "Please provied Data" })

        //=================================distructing=======================================>
        const { fname, lname, email, profileImage, phone, password, address, shipping, billing } = body



        //<=============================first Name check=========================================>
        if (!isValid(fname)) return res.status(400).send({ status: false, messge: "please provide First Name" })


        if (!isValidName(fname)) return res.status(400).send({ status: false, messge: "please Give Correct First Name" })



        //<=========================Last name Check==========================================>
        if (!isValid(lname)) return res.status(400).send({ status: false, message: "please provide last Name" })

        if (!isValidName(lname)) return res.status(400).send({ status: false, messge: "please Give Correct last Name" })



        //<================================Validation Check===================================>
        if (!email) return res.status(400).send({ status: false, message: "please provide Email Id" })


        //<==============================valid Email Id=======================================>
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "please given Valid Email" })



        //<=============================check Unique for Email=========================================>
        const isAlreadyEmail = await userModel.findOne({ email: email })
        if (isAlreadyEmail) return res.status(400).send({ status: false, message: "Email is already in Used" })



        //<===================================>profileImage with Clouding<==============================>

        if (!(files && files.length > 0)) {
            return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });
        }
        if(!isImageFile(files[0].originalname)) return res.status(400).send({ status: false, message: " Please Provide The Profile Image in jpeg,jpg,png,gif,JPGE,JPG,PNG,GIF" });

        const uploadedBookImage = await uploadFile(files[0])
        body.profileImage = uploadedBookImage



        //<=======================================phone Validation=============================================>
        if (!phone) return res.status(400).send({ status: false, message: "please provide phone Number" })


        //=====================================unique Check=========================================>
        const isAlreadyPhone = await userModel.findOne({ phone: phone })
        if (isAlreadyPhone) return res.status(400).send({ status: false, message: "Phone Number is already in Used" })


        //====================================valid Indian mobile number============================>
        if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: "please given Valid Indian Phone Number" })


        //====================================password==============================================>
        if (!password) return res.status(400).send({ status: false, message: "please given password" })


        //======================================password validation ==================================>
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password not valid..password length should be min 8 max 15 characters " })


        //======================================password Hashing============================================>
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        passwordValue = await bcrypt.hash(password, salt);
        body.password = passwordValue



        //<=====================================address=============================================>

        if (!address || Object.keys(address).length === 0) {
            return res.status(400).send({ status: false, message: "Please enter address and it should be in object!!" })
        }
        let addresss = JSON.parse(address)
        // console.log(addresss);
        //<========================================shipping street=========================================>
        if (!addresss.shipping.street) return res.status(400).send({ status: false, message: "please provide street" })
        if (!isValid(addresss.shipping.street)) return res.status(400).send({ status: false, message: "please Don't leave empty Street" })



        //<=========================================city=============================================>
        if (!addresss.shipping.city) return res.status(400).send({ status: false, message: "please provide city" })
        if (!isValid(addresss.shipping.city)) return res.status(400).send({ status: false, message: "please Don't leave empty city" })



        //<===========================================pincode===============================================>
        if (!addresss.shipping.pincode) return res.status(400).send({ status: false, message: "please provide Address" })

        if (!isValidPincode(addresss.shipping.pincode)) return res.status(400).send({ status: false, message: "please give proper pincode" })

        let options = {
            method: 'GET',
            url: `https://api.postalpincode.in/pincode/${addresss.shipping.pincode}`
        }
        let result = await axios(options)
        if (!result.data[0].PostOffice) return res.status(400).send({ status: false, message: "No city Found with provided pincode" })
        let cityByPincode = result.data[0].PostOffice[0].District
        if (addresss.shipping.city.toLowerCase() !== cityByPincode.toLowerCase()) return res.status(400).send({ status: false, message: "Provided Pincode city is different" })

        //=====================================billing street======================================>
        if (!addresss.billing.street) return res.status(400).send({ status: false, message: "please provide street" })
        if (!isValid(addresss.shipping.street)) return res.status(400).send({ status: false, message: "please Don't leave empty Street" })



        //=====================================city==============================================>
        if (!addresss.billing.city) return res.status(400).send({ status: false, message: "please provide city" })

        if (!isValidName(addresss.billing.city)) return res.status(400).send({ status: false, message: "please give city name in valid formate" })

        if (!isValid(addresss.billing.city)) return res.status(400).send({ status: false, message: "please Don't leave empty city" })



        //====================================pincode=================================================>
        if (!addresss.billing.pincode) return res.status(400).send({ status: false, message: "please provide pincode" })

        if (!isValidPincode(addresss.billing.pincode)) return res.status(400).send({ status: false, message: "please give proper pincode" })

        let options2 = {
            method: 'GET',
            url: `https://api.postalpincode.in/pincode/${addresss.billing.pincode}`
        }
        let result2 = await axios(options2)
        if (!result2.data[0].PostOffice) return res.status(400).send({ status: false, message: "No city Found with provided pincode" })
        let cityByPincode2 = result.data[0].PostOffice[0].District
        if (addresss.billing.city.toLowerCase() !== cityByPincode2.toLowerCase()) return res.status(400).send({ status: false, message: "Provided Pincode city is different" })


        body.address = addresss

        //===========================================creation time =====================================>

        const createUserDetails = await userModel.create(body)
        res.status(201).send({ status: true, message: "User created successfully", data: createUserDetails })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser }
