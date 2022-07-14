const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const validator = require("validator")
const aws= require("aws-sdk")


const { isValidTName, isValid, isValidIsbn, isValidDate, isValidObjectId, isValidBody, isValidName } = require('../validation/validation')


//——————————————————————————————Create Books———————————————————————————————————————————————————————————————————————————————————


const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;
        //——————————————————————————————Check BodyEmpty———————————
        if (isValidBody(data)) return res.status(400).send({ status: false, message: 'please enter body' })

        //——————————————————————————————Check Required Attributes———————————
        if (!("title" in data)) return res.status(400).send({ status: false, message: "Pls Enter Title, Its Required" })
        if (!("excerpt" in data)) return res.status(400).send({ status: false, message: "Pls Enter excerpt, Its Required" })
        if (!("ISBN" in data)) return res.status(400).send({ status: false, message: "Pls Enter ISBN, Its Required" })
        if (!("category" in data)) return res.status(400).send({ status: false, message: "Pls Enter category, Its Required" })
        if (!("subcategory" in data)) return res.status(400).send({ status: false, message: "Pls Enter subcategory, Its Required" })
        if (!("releasedAt" in data)) return res.status(400).send({ status: false, message: "Pls Enter releasedAt, Its Required" })

        //——————————————————————————————Validations———————————
        if (!isValid(title)) return res.status(400).send({ status: false, message: 'Dont left title Empty' })
        if (!isValidTName(title)) return res.status(400).send({ status: false, message: "Pls Enter Valid title" })

        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: 'Dont left Excerpt Empty' })
        if (!isValidTName(excerpt)) return res.status(400).send({ status: false, message: 'Pls Enter Valid excerpt' })

        //——————————————————————————————Validations———————————
        if (!isValid(userId)) return res.status(400).send({ status: false, message: 'Dont left UserId Empty' })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter UserId in Valid Format" })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: 'Dont left ISBN empty' })
        if (!isValid(category)) return res.status(400).send({ status: false, message: 'please enter category Dont left Empty' })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: 'please enter subcategory Dont left Empty' })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: 'please enter release date Dont left Empty' })
        if (!isValidIsbn(ISBN)) return res.status(400).send({ status: false, message: "please enter valid ISBN in this format x-xxx-xxxxx-x or xxx-x-xxx-xxxxx-x" })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please enter the date in 'YYYY-MM-DD' format" })
        
        //——————————————————————————————Check Unique Title———————————
        let usedTitle = await booksModel.findOne({ title: title })
        if (usedTitle) return res.status(400).send({ status: false, message: 'Title already exist' })
        //——————————————————————————————Check Unique ISBN———————————
        let usedIsbn = await booksModel.findOne({ ISBN: ISBN })
        if (usedIsbn) return res.status(400).send({ status: false, message: 'ISBN already exist' })
        //——————————————————————————————Check UserId———————————
        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) return res.status(404).send({ status: false, message: 'this user id does not exist' })

        if (typeof subcategory !== "string") {
            str = [...new Set(subcategory)]
            for (let i = 0; i < str.length; i++) {
                str[i] = str[i].toLowerCase()
            }
            data.subcategory = str
        }
        else { let lowered = subcategory.toLowerCase()
            data.subcategory = lowered}
            aws.config.update({
                accessKeyId: "AKIAY3L35MCRVFM24Q7U",
                secretAccessKey: "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",
                region: "ap-south-1"
            })
            
            let uploadFile= async ( file) =>{
               return new Promise( function(resolve, reject) {
                // this function will upload file to aws and return the link
                let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
            
                var uploadParams= {
                    ACL: "public-read",
                    Bucket: "classroom-training-bucket",  //HERE
                    Key: "abc/" + file.originalname, //HERE 
                    Body: file.buffer
                }
                s3.upload( uploadParams, function (err, data ){
                    if(err) {
                        return reject({"error": err})
                    }
                    console.log(data)
                    console.log("file uploaded succesfully")
                    return resolve(data.Location)
                })
               })
            }
            let files= req.files
            if(files && files.length>0){
             // upload to s3 and get the uploaded link
             // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile(files[0])
            data.bookCover =uploadedFileURL
            let saveData = await booksModel.create(data)
            res.status(201).send({ status: true, message: 'successfully book created and image uploaded', data: saveData})
            
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
            
        
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//—————————————————————————————— Get Books———————————————————————————————————————
const getBooks = async function (req, res) {
    try {
        const query = req.query
        const { userId, category, subcategory } = query

        let checkInput = Object.keys(query)

        let values = ["userId", "category", "subcategory"]
        for (let i = 0; i < checkInput.length; i++) {
            if (!(values.includes(checkInput[i]))) {
                return res.status(400).send({ status: false, message: `Query Attributes Should be ${values}` })
            }
        }

        for (let i = 0; i < checkInput.length; i++) {
            if (query[checkInput[i]] === "undefined" || query[checkInput[i]].trim().length == 0) return res.status(400).send({ status: false, message: `Dont left the ${checkInput[i]} attribute empty` })
        }

        const filter = { isDeleted: false }
        if (userId) {
            if (!isValid(userId)) return res.status(400).send({ status: false, message: "Dont Left UserId Attribute empty" })
            if (!isValidObjectId(userId)) return res.status(400).send({ status: false, messsage: "Pls Enter UserId in Valid Format" })
            if (await booksModel.findOne({ _id: userId })) return res.status(400).send({ status: false, message: "Dont Give BookId Give only UserId" })
            if (!(await userModel.findById(userId))) return res.status(404).send({ status: false, message: "This UserId DoesNot Exists" })
            filter.userId = userId
        }
        if (category) {
            if (!isValid(category)) return res.status(400).send({ status: false, message: "Dont Left Category Empty" })
            let trimcategory = category.trim().toLowerCase()
            filter.category = trimcategory
        }
        if (subcategory) {
            if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Dont Left subcategory Empty" })
            let lower = subcategory.trim().toLowerCase()
            filter.subcategory = { $all: lower.trim().split(",").map(e => e.trim()) }
        }

        let data = await booksModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
        if (data.length == 0) { return res.status(404).send({ status: false, message: "Sorry No Books Found or its deleted" }) }
        else { return res.status(200).send({ status: true, message: "Books list", data: data }) }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}
//—————————————————————————————— getBooksByParamsId———————————————————————————————————————

const getBooksByParamsId = async function (req, res) {
    try {
        const iD = req.params.bookId
        if (Object.keys(iD).length == 0) return res.status(400).send({ status: false, message: "Pls Provide BookId In Params" })
        if (!isValidObjectId(iD)) return res.status(400).send({ status: false, message: "Pls Enter BookId In Valid Format" })
        //——————————————————————————————Check if user give userId instead of bookid———————————————————————————————————————
        if (await userModel.findById(iD)) return res.status(400).send({ status: false, message: "Dont Add UserId Add Only BookId" })
        //——————————————————————————————Check if user give reviewId instead of bookid———————————————————————————————————————
        if (await reviewModel.findById(iD)) return res.status(400).send({ status: false, message: "Dont Add ReviewId Add Only BookId" })
        if (!(await booksModel.findOne({ $and: [{ _id: iD, isDeleted: false }] }))) return res.status(404).send({ status: false, message: "This Id Doesnot Exists" })

        let bookData = await booksModel.findById(iD).select({ ISBN: 0, deletedAt: 0, __v: 0 }).lean()
        let reviewData = await reviewModel.find({ $and: [{ bookId: iD, isDeleted: false }] }).select({ reviewedBy: 1, bookId: 1, reviewedAt: 1, rating: 1, review: 1 })
        bookData.reviewsData = reviewData
        res.status(200).send({ status: true, message: 'Books list', data: bookData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




//—————————————————————————————— update-Books———————————————————————————————————————————————————————————————————————————————————

const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, message: 'pls give a book id in params' })
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: 'pls give a valid book id in params' })
        let book = await booksModel.findById(bookId)
        if (!book) return res.status(404).send({ status: false, message: 'sorry, No such book exists with this Id' })

        let body = req.body;
        let { title, excerpt, releasedAt, ISBN } = body;

        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })
    
        //——————————————————————————————Validations———————————
       
        if (book && book.isDeleted == false) {
            if (body.hasOwnProperty("title")) {
                if (!isValid(title)) return res.status(400).send({ status: false, message: "Don't left title Empty" })
                if (!isValidName(title)) return res.status(400).send({ status: false, message: "Pls Enter Valid title" })
                if (await booksModel.findOne({ title: title })) return res.status(400).send({ status: false, message: 'the title has already been used' })
                let trimtitle = title.trim()
                book.title = trimtitle;
            }
            if (body.hasOwnProperty("excerpt")) {
                if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Don't left Excerpt Empty" })
                if (!isValidTName(excerpt)) return res.status(400).send({ status: false, message: 'Pls Enter Valid excerpt' })
                let trimexcerpt = excerpt.trim()
                book.excerpt = trimexcerpt;
            }
            if (body.hasOwnProperty("releasedAt")) {
                if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: 'please enter release date, Dont leave it Empty' })
                if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please enter the date in 'YYYY-MM-DD' format" })
                book.releasedAt = releasedAt
            }
            if (body.hasOwnProperty("ISBN")) {
                if (!isValid(ISBN)) return res.status(400).send({ status: false, message: 'Dont left ISBN empty' })
                if (!isValidIsbn(ISBN)) return res.status(400).send({ status: false, message: 'please enter valid ISBN' })
                if (await booksModel.findOne({ ISBN: ISBN })) return res.status(400).send({ status: false, message: 'the ISBN has already been used' })
                book.ISBN = ISBN
            }
            book.save()
            return res.status(200).send({ status: true, data: book })
        } else {
            return res.status(404).send({ satus: false, message: 'No such book found or it is deleted' })
        }
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




//——————————————————————————————Delete Books———————————————————————————————————————

const deleteBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, messsage: "Pls Enter bookId in Valid Format" })

        let book = await booksModel.findById(bookId);
        if (!book) return res.status(404).send({ status: false, message: "Book not found" })
        if (book.isDeleted == true) return res.status(400).send({ status: false, message: "This book is already deleted" });

        await booksModel.findOneAndUpdate({ _id: bookId }, {
            $set: { isDeleted: true, deletedAt: Date() }
        }, { new: true });

        res.status(200).send({ status: true, message: "Book is Successfully Deleted" });

    } catch (err) {

        res.status(500).send({ message: "Error", error: err.message })
    }

}

// ----------------------------------------------------------------------




module.exports = { createBooks, getBooks, getBooksByParamsId, deleteBooks, updateBook }
