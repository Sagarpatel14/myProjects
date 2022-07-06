const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");



const loginUser = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;

        if(Object.keys(userName).length===0) return res.status(400).send({msg:"User Name is requird"});
        if(Object.keys(password).length===0) return res.status(400).send({msg:"Password is requird"});

        if (!userName) return res.status(400).send({ msg: "please enter username" });
        if (!password) return res.status(400).send({ msg: "please enter password" });

        let user = await userModel.findOne({ email: userName, password: password });

        if (!user)
            return res.status(400).send({
                status: false,
                msg: "username or the password is not corerct",
            })

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                batch: "radon",
                organisation: "FunctionUp",
            },
            "project-3"
        );
        res.setHeader("x-api-key", token);

        res.status(200).send({ status: success, token: token });

    } catch (err) {

        console.log("This is the error:", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }

}


module.exports.loginUser = loginUser