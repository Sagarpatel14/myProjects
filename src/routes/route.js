const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const booksController = require('../controllers/booksController')

//——————————————————————————————Create User———————————————————————————————————————
router.post("/register",userController.createUser)


//=============================Craete Book==========================================

router.post('/books', booksController.createBooks)


module.exports=router