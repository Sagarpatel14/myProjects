const userModel= require("../models/userModel")
const {isValid,isValidTitle,isValidName,isValidEmail,isValidMobile,isValidPassword,isValidBody,isValidPincode}=require("../validation/validation")

const createUser=async function(req,res){
try{
    const body= req.body
    const {title,name,phone,email,password,address}= body
    const {pincode}=address

    if(isValidBody(body)) return res.status(400).send({status:false,msg:"Body Should Not be empty"})
    if(!("title" in body)) return res.status(400).send({status:false,msg:"Pls Enter Title Its Required"})
    if(!("name" in body)) return res.status(400).send({status:false,msg:"Pls Enter name Its Required"})
    if(!("phone" in body)) return res.status(400).send({status:false,msg:"Pls Enter Phone Attribute Its Required"})
    if(!("email" in body)) return res.status(400).send({status:false,msg:"Pls Enter Email Its Required"})
    if(!("password" in body)) return res.status(400).send({status:false,msg:"Pls Enter Password Its Required"})

    if(!isValid(title)) return res.status(400).send({status:false,msg:"Title should not be empty"})
    if(!isValidTitle(title)) return res.status(400).send({status:false,msg:"Title Should be Mr,Mrs,Miss"})
    
    if(!isValid(name)) return res.status(400).send({status:false,msg:"Name should not be empty"})
    if(!isValidName(name)) return res.status(400).send({status:false,msg:"Pls Enter Valid First Name"})
    
    if(!isValid(phone)) return res.status(400).send({status:false,msg:"Phone No. should not be empty"})
    if(!isValidMobile(phone)) return res.status(400).send({status:false,msg:"Pls Enter Valid Pan India No."})

    if(!isValid(email)) return res.status(400).send({status:false,msg:"Email should not be empty"})
    if(!isValidEmail(email)) return res.status(400).send({status:false,msg:"Pls Enter Email in Valid Format"})    

    if(!isValid(password)) return res.status(400).send({status:false,msg:"Password should not be empty"})
    if(!isValidPassword(password)) return res.status(400).send({status:false,msg:"Password must be in 8-15 characters long and it contains 1 Upper 1 lower 1 digit and 1 special character atleast"})

    if(!isValidPincode(pincode)) return res.status(400).send({status:false,msg:"Pls Enter Valid PAN Pincode"})

    let checkUniquePhone= await userModel.findOne({phone:phone})
    if(checkUniquePhone) return res.status(400).send({status:false,msg:"This No. Already Exists. Pls Use Unique Mobile No."})

    let checkUniqueMail= await userModel.findOne({email:email})
    if(checkUniqueMail) return res.status(400).send({status:false,msg:"This EmailId Already Exists. Pls Use Unique EmailId"})

    let saveddata= await userModel.create(body)
    res.status(201).send({status:true,Data:saveddata})
}
catch(err){
    res.status(500).send({status:false,msg:err.message})
}
}














module.exports={createUser}