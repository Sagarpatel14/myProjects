const { default: mongoose } = require('mongoose');
const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const { isValid, isValidIsbn, isValidDate, isValidObjectId, isValidBody } = require('../validation/validation')


const deleteBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, messsage: "Pls Enter bookId in Valid Format" })
        if (await userModel.findOne({ _id: bookId })) return res.status(400).send({ status: false, message: "Dont Give UserId Give only BookId" })
        if (!(await booksModel.findById(bookId))) return res.status(400).send({ status: false, message: "This BookId Doesn't Exist" })

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, messsage: "Pls Enter reviewId in Valid Format" })
        if (await userModel.findOne({ _id: bookId })) return res.status(400).send({ status: false, message: "Dont Give UserId Give only BookId" })
        if (!(await booksModel.findById(bookId))) return res.status(400).send({ status: false, message: "This BookId Doesn't Exist" })

        let book = await booksModel.findById(bookId);
        if (book.isDeleted == true) return res.status(400).send({ status: false, message: "This book is already deleted" });
        if (!book) return res.status(404).send({ status: false, message: "Book not found" })
        // blogData = req.body
        let deletedBook = await booksModel.findOneAndUpdate({ _id: bookId }, {
            $set: { isDeleted: true, deletedAt: Date() }
        }, { new: true });

        res.status(200).send({ status: true, message: "Success", data: deletedBook });

    } catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }

}


module.exports = { deleteBooks }