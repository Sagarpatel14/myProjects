const { default: mongoose } = require('mongoose');
const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const { isValid, isValidIsbn, isValidDate, isValidObjectId, isValidBody, isValidName, isValidExcerpt } = require('../validation/validation')


let updateReview = async function(req, res){
    try{
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
        let {reviewedBy,rating,review } = body;
        
        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })
        
        if (!("reviewedBy" in body)) return res.status(400).send({ status: false, message: "Pls Enter reviewrs name, Its Required" })
        if (!("rating" in body)) return res.status(400).send({ status: false, message: "Pls Enter rating, Its Required" })
        if (!("review" in body)) return res.status(400).send({ status: false, message: "Pls Enter review, Its Required" })
        
        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Don't left reviewrs name Empty" })
        if (!isValid(rating)) return res.status(400).send({ status: false, message: "Don't left rating Empty" })
        if (!isValid(review)) return res.status(400).send({ status: false, message: "Don't left review Empty" })

        if(book && book.isDeleted == false){
            
        }

       
    }catch(err){
        return res.status(500).send({status:false, message:err.message})

    }
}