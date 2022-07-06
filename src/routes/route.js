const express = require("express");
const router = express.Router();
const userController= require("../controllers/userController")
const booksController = require('../controllers/booksController')
const mw=require("../middlewares/middleware")

//——————————————————————————————Create User———————————————————————————————————————
router.post("/register",userController.createUser)
//——————————————————————————————Login User———————————————————————————————————————
router.post("/login", userController.loginUser);
//——————————————————————————————Create Books———————————————————————————————————————
router.post('/books',mw.authe,mw.autho, booksController.createBooks)
//——————————————————————————————Get Books———————————————————————————————————————
router.get("/books",booksController.getBooks)


module.exports=router