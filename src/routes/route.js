const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const booksController = require('../controllers/booksController')

//——————————————————————————————Create User———————————————————————————————————————
router.post("/register",userController.createUser)
//——————————————————————————————Create Books———————————————————————————————————————
router.post('/books', booksController.createBooks)
//——————————————————————————————Get Books———————————————————————————————————————
router.get("/books",booksController.getBooks)




module.exports=router