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
//——————————————————————————————Delete Books by BookId———————————————————————————————————————
router.delete("/books/:bookId", mw.authe,mw.autho, booksController.deleteBooks)
//——————————————————————————————Delete Books by BookId & ReviewId———————————————————————————————————————
router.delete("/books/:bookId/review/:reviewId", mw.authe,mw.autho, booksController.deleteBooks)


module.exports=router