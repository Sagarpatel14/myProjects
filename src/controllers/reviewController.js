const { default: mongoose } = require('mongoose');
const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const { isValid, isValidIsbn, isValidDate, isValidObjectId, isValidBody, isValidName, isValidExcerpt, isValidrating, isValidratingLength } = require('../validation/validation')


let updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId) return res.status(400).send({ status: false, message: 'pls give a book id in params' })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: 'pls give a valid book id in params' })
        let book = await booksModel.findById(bookId)
        if (!book) return res.status(400).send({ status: false, message: 'sorry, No such book exists' })

        let reviewId = req.params.reviewId;
        if (!reviewId) return res.status(400).send({ status: false, message: 'pls give a review id in params' })
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: 'pls give a valid review id in params' })
        let reviews = await booksModel.findById(bookId)
        if (!reviews) return res.status(400).send({ status: false, message: 'sorry, No such review exists' })

        let body = req.body;
        let { reviewedBy, rating, review } = body;

        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })

        if (!("reviewedBy" in body)) return res.status(400).send({ status: false, message: "Pls Enter reviewrs name, Its Required" })
        if (!("rating" in body)) return res.status(400).send({ status: false, message: "Pls Enter rating, Its Required" })
        if (!("review" in body)) return res.status(400).send({ status: false, message: "Pls Enter review, Its Required" })

        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Don't left reviewrs name Empty" })
        if (!isValid(rating)) return res.status(400).send({ status: false, message: "Don't left rating Empty" })
        if (!isValid(review)) return res.status(400).send({ status: false, message: "Don't left review Empty" })

        if (book && book.isDeleted == false) {
            if (reviewedBy) {
                if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Pls Enter Valid title" })
                reviews.reviewedBy = reviewedBy
            }

            if (rating) {
                if (!isValidrating(rating)) return res.status(400).send({ status: false, message: "Dont Add String to Rating(Number) attribute" })
                if (!isValidratingLength(rating)) return res.status(400).send({ status: false, message: "The Rating Value must Between 1 to 5" })
                reviews.reviewedBy = reviewedBy
            }

            if (review) {
                reviews.review = review
            }
            reviews.save();
            return res.status(200).send({ status: true, data: reviews })
        } else {
            return res.status(404).send({ satus: false, message: 'No such book found' })
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}




//—————————————————————————————— POST review By BookId in params———————————————————————————————————————

const addReview = async function (req, res) {

    let bookId = req.params.bookId
    if (!(isValidObjectId(bookId))) return res.status(400).send({ status: false, message: "Pls Enter BookId In valid Format" })
    if (await userModel.findById(bookId)) return res.status(400).send({ status: false, message: "Dont Add UserId In Params..Add only BookId" })
    if (!(await booksModel.findOne({ $and: [{ _id: bookId, isDeleted: false }] }))) return res.status(400).send({ status: false, message: "Sorry This Id Doesnot Exists" })
    let body = req.body
    const { review, rating, reviewedBy } = body
    if (isValidBody(body)) return res.status(400).send({ status: false, message: "Dont Left Body Empty" })
    if (!("review" in body)) return res.status(400).send({ status: false, message: "Dont Skip review attribute its mandatory" })
    if (!("rating" in body)) return res.status(400).send({ status: false, message: "Dont Skip rating attribute its mandatory" })
    if (!("reviewedBy" in body)) return res.status(400).send({ status: false, message: "Dont Skip reviewedBy attribute its mandatory" })

    if (!isValid(review)) return res.status(400).send({ status: false, message: "Dont Left review attribute Empty" })
    if (!isValidrating(rating)) return res.status(400).send({ status: false, message: "Dont Add String to Rating(Number) attribute" })
    if (!isValidratingLength(rating)) return res.status(400).send({ status: false, message: "The Rating Value must Between 1 to 5 " })
    if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Dont Left reviewedBy attribute Empty" })
    if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Pls Enter Valid Name" })


    body.bookId = bookId, body.reviewedAt = new Date().toISOString()
    let createdData = await reviewModel.create(body)
    let data = {
        _id: createdData._id, bookId: createdData.bookId, reviewedBy: createdData.reviewedBy, reviewedAt: createdData.reviewedAt,
        rating: createdData.rating, review: createdData.review
    }

    let book = await booksModel.findOne({ _id: bookId })
    let count = book.reviews
    count = count + 1
    await booksModel.findOneAndUpdate({ _id: bookId }, { $set: { reviews: count } })
    res.status(201).send({ status: true, message: "Succefully Added", data: data })

}




module.exports = { addReview, updateReview }
