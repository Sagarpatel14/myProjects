const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

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


const loginUser = async function (req, res) {
    try {
        let body = req.body
        const{userName,password}=body

        if(isValidBody(body)) return res.status(400).send({msg:"Body Should not be empty"});
    
        if (!("userName" in body)) return res.status(400).send({ status: false, msg: "please enter username" });
        if (!("password" in body)) return res.status(400).send({ status: false, msg: "please enter password" });
        if(!isValid(userName)) return res.status(400).send({status:false, msg: "UserName should not be empty"})
        if(!isValid(password)) return res.status(400).send({status:false, msg: "Password should not be empty"})
        let user = await userModel.findOne({ email: userName, password: password });

        if (!user)
            return res.status(400).send({
                status: false,
                msg: "Please use valid credentials",
            })

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (2 * 60),
                batch: "radon",
                organisation: "FunctionUp",
            },
            "project-3"
        );
        res.setHeader("x-api-key", token);

        res.status(200).send({ status: true, token: token });

    } catch (err) {

        console.log("This is the error:", err)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}



module.exports={createUser, loginUser};

