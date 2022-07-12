const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const { isValid,isValidTName, isValidObjectId, isValidBody, isValidName, isValidrating, isValidratingLength } = require('../validation/validation')


//—————————————————————————————— POST review By BookId in params———————————————————————————————————————

const addReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!(isValidObjectId(bookId))) return res.status(400).send({ status: false, message: "Pls Enter BookId In valid Format" })
        if (await userModel.findById(bookId)) return res.status(400).send({status:false,message:"Add only BookId instead of userId"})
        if (await reviewModel.findOne({_id:bookId})) return res.status(400).send({status:false,message:"Add only BookId instead of reviewId"})
        
        //—————————————————————————————— check if user give userid instead of BookId———————————————————————————————————————
        
        if (!(await booksModel.findOne({ $and: [{ _id: bookId, isDeleted: false }] }))) return res.status(404).send({ status: false, message: "Sorry This Id Doesnot Exists or its deleted" })
        
        let body = req.body
        const { review, rating, reviewedBy } = body
        
        
        if (isValidBody(body)) return res.status(400).send({ status: false, message: "Dont Left Body Empty" })
        //—————————————————————————————— Mandatory Fields checking———————————————————————————————————————
        if (!("rating" in body)) return res.status(400).send({ status: false, message: "Dont Skip rating attribute its mandatory" })
        if (("reviewedBy" in body)) {
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Dont Left reviewedBy attribute Empty" })
            if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Pls Enter Valid Name" })
        }
        
        //—————————————————————————————— Validations———————————————————————————————————————
         if("review" in body) {
        if (!isValid(review)) return res.status(400).send({ status: false, message: "Dont Left review attribute Empty" })
        if (!isValidName(review)) return res.status(400).send({ status: false, message: "Pls Enter Valid review" })
       }
        if (!isValidrating(rating)) return res.status(400).send({ status: false, message: "Dont Add String to Rating(Number) attribute" })
        if (!isValidratingLength(rating)) return res.status(400).send({ status: false, message: "The Rating Value must Between 1 to 5 " })
        


        body.bookId = bookId, body.reviewedAt = new Date().toISOString()
        if(!("reviewedBy" in body)){
            body.reviewedBy="Guest"
        }
        let createdData = await reviewModel.create(body)
        let data = [{
            _id: createdData._id, bookId: createdData.bookId, reviewedBy: createdData.reviewedBy, reviewedAt: createdData.reviewedAt,
            rating: createdData.rating, review: createdData.review}]
        let book= await booksModel.findOneAndUpdate({ _id: bookId },  {$inc:{reviews:1}}  ,{new:true} ).select({ISBN:0,__v:0}).lean()
        book.reviewsData=data
       
        res.status(201).send({ status: true, message: "Succefully Added", data: book })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//—————————————————————————————— Update review By BookId in params———————————————————————————————————————

let updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!bookId) return res.status(400).send({ status: false, message: 'pls give a book id in params' })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: 'pls give a valid book id in params' })
        let bookData = await booksModel.findById(bookId)
        ////——————————————————————————————checking whether the boook is deleted or not 
        if(!bookData) return res.status(404).send({status: false,message:'this bookId does not exist'})
        if(bookData.isDeleted==true) return res.status(400).send({status: false,message:'this book is already deleted'})
        
        let reviewId = req.params.reviewId;
        ////——————————————————————————————check review id is present in params or not 
        if (!reviewId) return res.status(400).send({ status: false, message: 'pls give a review id in params' })
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: 'pls give a valid review id in params' })
        ////——————————————————————————————check whether the user gave userId instead of reviewId
        if(await userModel.findOne({_id :reviewId })) return res.status(400).send({status:false, message:'Pls give reviewId instead of userId'})
        ////——————————————————————————————check whether the user gave bookId instead of reviewId
        if(await booksModel.findOne({_id :reviewId })) return res.status(400).send({status:false, message:'Pls give reviewId instead of bookId'})
        let reviewData = await reviewModel.findById(reviewId)
        if (!reviewData) return res.status(404).send({ status: false, message: 'sorry, No such review exists' })
        
        let findReview = await reviewModel.findOne({ $and: [{ bookId: bookId, _id: reviewId }] });
        if(!findReview) return res.status(404).send({status:false,message:"Sorry No review found With this bookId And this review id"})
        if (findReview.isDeleted == true) return res.status(400).send({ status: false, message: "This review is already deleted" })
        
        let body = req.body;
        let { reviewedBy, rating, review } = body;
        
        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'Dont Left Body Empty' })
        
        //—————————————————————————————— Mandatory Fields checking———————————————————————————————————————
        if (!("reviewedBy" in body)) return res.status(400).send({ status: false, message: "Pls Enter reviewrs name, Its Required" })
        if (!("rating" in body)) return res.status(400).send({ status: false, message: "Pls Enter rating, Its Required" })
        if (!("review" in body)) return res.status(400).send({ status: false, message: "Pls Enter review, Its Required" })
        
        //—————————————————————————————— Validations———————————————————————————————————————
        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Don't left ReviewedBy Empty" })
        if (!isValidrating(rating)) return res.status(400).send({ status: false, message: "Dont Add String to Rating(Number) attribute" })
        if (!isValidratingLength(rating)) return res.status(400).send({ status: false, message: "The Rating Value must Between 1 to 5" })
        if (!isValid(review)) return res.status(400).send({ status: false, message: "Don't left review Empty" })

            if (reviewedBy) {
                if (!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "Pls Enter Valid reviewers name" })
                let trimmedName =reviewedBy.trim()
                reviewData.reviewedBy = trimmedName
            }

            if (rating) {
                reviewData.rating = rating
            }

            if (review) {
                if (!isValidTName(review)) return res.status(400).send({ status: false, message: "Pls Enter Valid review in only alphabatical characters" })
                let trimmedReview = review.trim()
                reviewData.review = trimmedReview
            }
            reviewData.save();
            let data = [{
                _id: reviewData._id, bookId: reviewData.bookId, reviewedBy: reviewData.reviewedBy, reviewedAt: reviewData.reviewedAt,
                rating: reviewData.rating, review: reviewData.review}]
        
            let book= await booksModel.findOne({ _id: bookId }).select({ISBN:0,__v:0}).lean()
            book.reviewsData=data

            res.status(200).send({ status: true, data :book  })

        }
     catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })

    }
}

//——————————————————————————————deleteReview ———————————————————————————————————————

const deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, messsage: "Pls Enter bookId in Valid Format" })
        // ——————————————————————————————Check whether book is deleted or not
        let checkBookDeleted = await booksModel.findById(bookId)
        if (!(await booksModel.findById(bookId))) return res.status(404).send({ status: false, message: "This BookId Doesn't Exist" })
        if(checkBookDeleted.isDeleted == true) return res.status(400).send({status: false, message: "Sorry, this book is deleted"})

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, messsage: "Pls Enter reviewId in Valid Format" })
        // ——————————————————————————————Checking if User Give UserId instead of ReviewId
        if (await userModel.findOne({ _id: reviewId })) return res.status(400).send({ status: false, message: "Dont Give UserId on the place of reviewId" })
        // ——————————————————————————————Checking if User Give BookId instead of ReviewId
        if(await booksModel.findOne({_id: reviewId})) return res.status(400).send({ status: false, message: "Dont Give bookId on the place of reviewId" }) 
        
        if (!(await reviewModel.findById(reviewId))) return res.status(404).send({ status: false, message: "This reviewId Doesn't Exist" })

        let findReview = await reviewModel.findOne({ $and: [{ bookId: bookId, _id: reviewId }] });
        if (!findReview) return res.status(404).send({ status: false, message: "Review not found" });
        if (findReview.isDeleted == true) return res.status(400).send({ status: false, message: "This review is already deleted" });
         await reviewModel.findOneAndUpdate({_id:reviewId},{ isDeleted: true }, { new: true })
        await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        res.status(200).send({ status: true, message: "Your Review Is Successfully Deleted" });

    } catch (err) {
        console.log("This is the error:", err)
        res.status(500).send({ message: "Error", error: err.message })
    }

}

module.exports = { addReview, deleteReview, updateReview }
