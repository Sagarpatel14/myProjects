const userModel = require('../models/userModel') // require userModel
//<===========require Validation and destructing==============================================>
const { isValidName, isValidEmail, isValidMobile, isValidPassword, isValidObjectId, isValidRequestBody, isValid, isValidtitle, isValidDate, isValidAddress } = require('../validation/valid')


//<==================================user Create =======================================>
const createUser = async function(req,res){
    const body = req.body
    
    

    const {fname,lname,email,profileImage,phone,password,address,shipping,billing} = body





}