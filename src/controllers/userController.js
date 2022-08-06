const userModel = require('../models/userModel') // require userModel
const aws = require("aws-sdk")//require Clouding
const bcrypt = require('bcrypt');//require password bcrypt
const { uploadFile } = require('../validation/aws')
const jwt = require('jsonwebtoken')

const { validInstallment, isValidPrice, isValidSize, isImageFile, isValid, isValidName, isValidEmail, isValidExcerpt, isValidMobile, isValidPassword, isValidIsbn, isValidBody, isValidTitle, isValidPincode, isValidDate, isValidObjectId, isValidrating, isValidratingLength, isValidTName } = require('../validation/valid')
//<==================================user Create =======================================>
const createUser = async function (req, res) {
    try {
        const body = req.body
        // console.log(body)
        //<==========================body Check =============================================>
        if (isValidBody(body)) return res.status(400).send({ status: false, message: "Please enter body" })
        const { fname, lname, email, profileImage, phone, password, address, shipping, billing } = body



        //<=============================first Name check=========================================>
        if (!isValid(fname)) return res.status(400).send({ status: false, messge: "please provide First Name" })

        if (!isValidName(fname)) return res.status(400).send({ status: false, messge: "please Give valid First Name" })



        //<=========================Last name Check==========================================>
        if (!isValid(lname)) return res.status(400).send({ status: false, message: "please provide last Name" })

        if (!isValidName(lname)) return res.status(400).send({ status: false, messge: "please Give valid last Name" })



        //<================================Validation Check===================================>
        if (!email) return res.status(400).send({ status: false, message: "please provide Email Id" })


        //<==============================valid Email Id=======================================>
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "please give Valid Email" })



        //<=============================check Unique =========================================>
        const isAlreadyEmail = await userModel.findOne({ email: email })
        if (isAlreadyEmail) return res.status(400).send({ status: false, message: "Email is already exist" })



        //<===================================>profileImage with Clouding<==========================>
        let files = req.files
        //console.log(files);
        if (!(files && files.length > 0)) {
            return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });
        }
        if (!isImageFile(files[0].originalname)) return res.status(400).send({ status: false, message: " Please Provide The Profile Image in jpeg,jpg,png,gif,JPGE,JPG,PNG,GIF" });

        const uploadedBookImage = await uploadFile(files[0])
        body.profileImage = uploadedBookImage



        //<=======================================phone Validation=============================================>
        if (!phone) return res.status(400).send({ status: false, message: "please provide phone Number" })


        //=====================================unique Check=========================================>
        const isAlreadyPhone = await userModel.findOne({ phone: phone })
        if (isAlreadyPhone) return res.status(400).send({ status: false, message: "Phone Number is already exist" })


        //====================================valid Indian mobile number============================>
        if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: "please give Valid Phone Number" })


        //====================================password==============================================>
        if (!password) return res.status(400).send({ status: false, message: "please give password" })


        //======================================password validation ==================================>
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "the password should be of 8 to 15 character and should atleast contains one lowercase, one upercase, one special character and one number" })


        //======================================password Hashing============================================>
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        passwordValue = await bcrypt.hash(password, salt);
        body.password = passwordValue



        //<=====================================address=============================================>

        if (!address || Object.keys(address).length === 0) {
            return res.status(400).send({ status: false, message: "Please enter address and it should be in object!!" })
        }

        let addresss;
        if (address) {
            try {
                addresss = JSON.parse(address);
            } catch (e) {
                return res.status(400).send({ status: false, message: 'address should be an object' })
            }
        }


        //<========================================shipping street=========================================>
        if (!addresss.shipping.street) return res.status(400).send({ status: false, message: "please provide street" })
        if (!isValid(addresss.shipping.street)) return res.status(400).send({ status: false, message: "please Don't leave empty Street" })



        //<=========================================city=============================================>
        if (!addresss.shipping.city) return res.status(400).send({ status: false, message: "please provide city" })
        if (!isValid(addresss.shipping.city)) return res.status(400).send({ status: false, message: "please Don't leave empty city" })



        //<==========================================================================================>
        if (!addresss.shipping.pincode) return res.status(400).send({ status: false, message: "please provide Address" })

        if (!isValidPincode(addresss.shipping.pincode)) return res.status(400).send({ status: false, message: "please give proper pincode" })



        //=====================================billing street====================================>
        if (!addresss.billing.street) return res.status(400).send({ status: false, message: "please provide street" })
        if (!isValid(addresss.shipping.street)) return res.status(400).send({ status: false, message: "please Don't leave empty Street" })



        //=====================================city==============================================>
        if (!addresss.billing.city) return res.status(400).send({ status: false, message: "please provide city" })

        if (!isValid(addresss.billing.city)) return res.status(400).send({ status: false, message: "please Don't leave empty city" })



        //====================================pincode=================================================>
        if (!addresss.billing.pincode) return res.status(400).send({ status: false, message: "please provide pincode" })

        if (!isValidPincode(addresss.billing.pincode)) return res.status(400).send({ status: false, message: "please give proper pincode" })

        body.address = addresss

        //===========================================creation time =====================================>

        const createUserDetails = await userModel.create(body)
        res.status(201).send({ status: true, message: "User created successfully", data: createUserDetails })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}




const loginUser = async function (req, res) {
    try {

        let body = req.body
        let { email, password } = body

        if (isValidBody(body)) return res.status(400).send({ Status: false, message: " Sorry Body can't be empty" })

        //*------------------- Email validation -------------------*** //

        if (!('email' in body)) return res.status(400).send({ status: false, msg: "Email is required" })
        if (!isValid(email)) { return res.status(400).send({ status: false, msg: "do not leave email empty" }) };
        if (!isValidEmail(email)) { return res.status(400).send({ status: false, message: ' Email should be a valid' }) };

        //**------------------- password validation -------------------** //
        if (!('password' in body)) return res.status(400).send({ status: false, msg: "password is required" })
        if (!isValid(password)) { return res.status(400).send({ Status: false, message: "do not leave password empty" }) }

        //**------------------- checking User Detail -------------------** //
        let checkUser = await userModel.findOne({ email });
        if (!checkUser) { return res.status(401).send({ Status: false, message: "email is not correct" }); }

        let passwordMatch = await bcrypt.compare(password, checkUser.password)
        if (passwordMatch == false) { return res.status(401).send({ status: false, msg: "incorect password" }) }
        //**------------------- generating token for user -------------------** //
        let userToken = jwt.sign({ UserId: checkUser._id, batch: "Radon" }, 'FunctionUp Group30', { expiresIn: '86400s' }); // token expiry for 24hrs
        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: checkUser._id, token: userToken } });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}



const getUser = async function (req, res) {
    try {
        //---------reading userid from ----//
        const _id = req.params.userId;

        //------id format validation-------//
        if (_id) { if (!isValidObjectId(_id)) { return res.status(400).send({ status: false, message: "Invalid userId" }); } }

        const user = await userModel.findOne({ _id: _id }, { isDeleted: false })
        //------no users found-------//
        if (!user) { return res.status(404).send({ status: false, message: "user not found" }); }
        //------return user in response------//
        return res.status(200).send({ status: true, message: "Success", data: user });

    } catch (error) { res.status(500).send({ status: false, msg: error.message }) }
}





const updateUser = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!userId) return res.status(400).send({ status: false, message: 'pls give a userId in params' })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'pls give a valid userId in params' })
        let user = await userModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, message: 'sorry, No such user exists with this Id' })

        let body = req.body; 
        
        console.log(body)
        let { fname, lname, email, phone, password, address, shipping, billing } = body;
        let files = req.files
        if (Object.keys(body).length === 0 && req.files == undefined) return res.status(400).send({ status: false, message: 'please enter body' })
        // pending work in files isvalidfiles
        //if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })

        let obj = {};
        if (fname == "") return res.status(400).send({ status: false, message: "Don't leave fname Empty" })
        if (fname) {
            if (!isValid(fname)) return res.status(400).send({ status: false, message: "Don't leave fname Empty" })
            if (!isValidName(fname)) return res.status(400).send({ status: false, message: "Pls Enter Valid fname" })
            obj.fname = fname.trim().toLowerCase()
        }
        if (lname == "") return res.status(400).send({ status: false, message: "Don't leave lname Empty" })
        if (lname) {
            if (!isValid(lname)) return res.status(400).send({ status: false, message: "Don't leave lname Empty" })
            if (!isValidName(lname)) return res.status(400).send({ status: false, message: "Pls Enter Valid lname" })
            obj.lname = lname.trim().toLowerCase()
        }
        if (email == "") return res.status(400).send({ status: false, message: "Don't leave email Empty" })
        if (email) {
            if (!isValid(email)) return res.status(400).send({ status: false, message: "Don't leave email Empty" })
            if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Pls Enter Valid email" })
            if (await userModel.findOne({ email })) return res.status(400).send({ status: false, message: "this email has already been used" })
            obj.email = email.trim()
        }
        if (files.length != 0) {
            
            if (files.length == 0) {
                return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });
            }
            if (!isImageFile(files[0].originalname)) return res.status(400).send({ status: false, message: " Please Provide The Profile Image in jpeg,jpg,png,gif,JPGE,JPG,PNG,GIF" });
    
            const uploadedBookImage = await uploadFile(files[0])
            obj.profileImage = uploadedBookImage
    
        }
        if (phone == "") return res.status(400).send({ status: false, message: "Don't leave phone Empty" })
        if (phone) {
            if (!isValid(phone)) return res.status(400).send({ status: false, message: "Don't leave phone number Empty" })
            if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: "Pls Enter Valid phone number" })
            if (await userModel.findOne({ phone })) return res.status(400).send({ status: false, message: "this phone number has already been used" })
            obj.phone = phone.trim()
        }
        if (password == "") return res.status(400).send({ status: false, message: "Don't leave password Empty" })
        if (password) {
            if (!isValid(password)) return res.status(400).send({ Status: false, message: " password is required" })
            if (!isValidPassword(password)) return res.status(400).send({ Status: false, message: " Please enter a valid password, minlength 8, maxxlength 15" })
            //generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            bcryptedPassword = await bcrypt.hash(password, salt);
            obj["password"] = bcryptedPassword
        }
        if (address == "") return res.status(400).send({ status: false, message: "Don't leave address Empty" })
        if ("address" in body) {
            // address = JSON.stringify(address)
            //address = JSON.parse(address)


            if (!address || Object.keys(address).length === 0) {
                return res.status(400).send({ status: false, message: "Please enter address and it should be in object!!" })
            }
            let addresss;
            if (address) {
                try {
                    addresss = JSON.parse(address);
                } catch (e) {
                    return res.status(400).send({ status: false, message: 'address should be an object' })
                }
            }
            const { shipping, billing } = addresss
            if ("shipping" in addresss) {
                const { street, city, pincode } = shipping
                if ("street" in shipping) {
                    if (!isValid(street)) {
                        return res.status(400).send({ status: false, message: "street is not valid" })
                    }
                    obj["addresss.shipping.street"] = street
                }
                if ("city" in shipping) {
                    if (!isValid(city)) return res.status(400).send({ status: false, message: "city is not valid" })
                    if (!isValidName(city)) return res.status(400).send({ status: false, message: "city name is not in valid format" })

                    obj["addresss.shipping.city"] = city
                }
                if ("pincode" in shipping) {
                    if (!isValid(pincode)) return res.status(400).send({ status: false, message: "pincode is not valid" })
                    if (!isValidPincode(pincode)) return res.status(400).send({ status: false, message: "pincode is not in valid format" })
                    obj["addresss.shipping.pincode"] = pincode
                }
            }

            if ("billing" in addresss) {
                const { street, city, pincode } = billing
                if ("street" in billing) {
                    if (!isValid(street)) return res.status(400).send({ status: false, message: "street is not valid" })
                    obj["addresss.billing.street"] = street
                }

                if ("city" in billing) {
                    if (!isValid(city)) return res.status(400).send({ status: false, message: "city is not valid" })
                    if (!isValidName(city)) return res.status(400).send({ status: false, message: "city name is not in valid format" })
                    obj["addresss.billing.city"] = city
                }
                if ("pincode" in billing) {
                    if (!isValid(pincode)) return res.status(400).send({ status: false, message: "shipping pincode is not valid" })
                    if (!isValidPincode(pincode)) return res.status(400).send({ status: false, message: "pincode is not in valid format" })
                    obj["addresss.billing.pincode"] = pincode
                }
            }
            obj["address"] = addresss
        }

        let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: obj }, { new: true })
        res.status(200).send({ status: true, message: "User profile updated", data: updatedUser })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { createUser, loginUser, getUser, updateUser }
