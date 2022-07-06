const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController")


//——————————————————————————————Create User———————————————————————————————————————
router.post("/register",userController.createUser)

//——————————————————————————————Login User———————————————————————————————————————
router.post("/login", userController.loginUser);

module.exports=router