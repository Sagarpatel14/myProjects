const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const booksController = require('../controllers/booksController')
const reviewController = require("../controllers/reviewController")
const mw = require("../middlewares/middleware")

//——————————————————————————————Create User———————————————————————————————————————
router.post("/register", userController.createUser)
//——————————————————————————————Login User———————————————————————————————————————
router.post("/login", userController.loginUser);
//——————————————————————————————Create Books ———————————————————————————————————————
router.post('/books', mw.authe, mw.autho, booksController.createBooks)
//—————————————————————— Get Books ————————————————————————————————
router.get('/books', mw.authe, booksController.getBooks)
//—————————————————————— Get Books By ParamsId ————————————————————————————————
router.get("/books/:bookId", mw.authe, booksController.getBooksByParamsId)
//—————————————————————— Post Review  ————————————————————————————————
router.post("/books/:bookId/review",reviewController.addReview)
//—————————————————————— Update Book By BookId  ————————————————————————————————
router.put('/books/:bookId', mw.authe, mw.autho, booksController.updateBook)
//—————————————————————— Update Review By BookId and ReviewID ————————————————————————————————
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)
//—————————————————————— Delete Book By BookId ————————————————————————————————
router.delete("/books/:bookId", mw.authe, mw.autho, booksController.deleteBooks)
//—————————————————————— Delete Review by BookId and ReviewId ————————————————————————————————
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview)


router.post("/write-book-cover/:bookId",)

module.exports = router
