const express = require("express");
const router = express.Router();
const userController= require("../controllers/userController")
const booksController = require('../controllers/booksController')
const reviewController =require("../controllers/reviewController")
const mw=require("../middlewares/middleware")

//——————————————————————————————Create User———————————————————————————————————————
router.post("/register",userController.createUser)
//——————————————————————————————Login User———————————————————————————————————————
router.post("/login", userController.loginUser);
//——————————————————————————————Create Books or Get Books———————————————————————————————————————
router.route('/books')                 
.post(mw.authe,mw.autho, booksController.createBooks)
.get(booksController.getBooks)   

router.route("/books/:bookId")
.get(booksController.getBooksByParamsId)

router.post("/books/:bookId/review",mw.authe,mw.autho,reviewController.addReview)
router.get("/books/:bookId",mw.authe,booksController.getBooksByParamsId)

router.put('/books/:bookId',mw.authe,mw.autho, booksController.updateBooks)

module.exports=router