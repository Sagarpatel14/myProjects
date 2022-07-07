const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const reviewModel=require("../models/reviewModel")
const {isValid,isValidIsbn, isValidDate,isValidObjectId,isValidBody} = require('../validation/validation')

//——————————————————————————————Create Books———————————————————————————————————————————————————————————————————————————————————
const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if (isValidBody(data)) return res.status(400).send({ status: false, message: 'please enter body' })

        if (!("title" in data)) return res.status(400).send({ status: false, message: "Pls Enter Title, Its Required" })
        if (!("excerpt" in data)) return res.status(400).send({ status: false, message: "Pls Enter excerpt, Its Required" })
        if (!("ISBN" in data)) return res.status(400).send({ status: false, message: "Pls Enter ISBN, Its Required" })
        if (!("category" in data)) return res.status(400).send({ status: false, message: "Pls Enter category, Its Required" })
        if (!("subcategory" in data)) return res.status(400).send({ status: false, message: "Pls Enter subcategory, Its Required" })
        if (!("releasedAt" in data)) return res.status(400).send({ status: false, message: "Pls Enter releasedAt, Its Required" })


        if (!isValid(title)) return res.status(400).send({ status: false, message: 'Dont left title Empty' })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: 'Dont left Excerpt Empty' })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: 'Dont left UserId Empty' })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: 'Dont left Excerpt Empty ISBN' })
        if (!isValid(category)) return res.status(400).send({ status: false, message: 'please enter category Dont left Empty' })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: 'please enter subcategory Dont left Empty' })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: 'please enter release date Dont left Empty' })
        if (!isValidIsbn(ISBN)) return res.status(400).send({ status: false, message: 'please enter valid ISBN' })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please enter the date in 'YYYY-MM-DD' format" })

        let usedTitle = await booksModel.findOne({ title: title })
        if (usedTitle) return res.status(400).send({ status: false, message: 'title already exist' })

        let usedIsbn = await booksModel.findOne({ ISBN: ISBN })
        if (usedIsbn) return res.status(400).send({ status: false, message: 'ISBN already exist' })

        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) return res.status(400).send({ status: false, message: 'this user id does not exist' })

        let saveData = await booksModel.create(data)
      
        res.status(201).send({status : true, message : 'success', data : saveData})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}
//—————————————————————————————— Get Books———————————————————————————————————————

const getBooks= async function(req,res){
try{    
    const query=req.query
    const{userId,category,subcategory}=query

        const filter = { isDeleted: false }
        if (userId) {
            if (!isValidObjectId(userId)) return res.status(400).send({ status: false, messsage: "Pls Enter UserId in Valid Format" })
            if (await booksModel.findOne({ _id: userId })) return res.status(400).send({ status: false, message: "Dont Give BookId Give only UserId" })
            if (!(await userModel.findById(userId))) return res.status(400).send({ status: false, message: "This UserId DoesNot Exists" })
            filter.userId = userId
        }
        if (category) {
            if (!isValid(category)) return res.status(400).send({ status: false, message: "Dont Left Category Empty" })
            filter.category = category.trim()
        }
        if (subcategory) {
            if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Dont Left subcategory Empty" })
            filter.subcategory = { $all: subcategory.trim().split(",").map(e => e.trim()) }
        }
        let data = await booksModel.find(filter).sort({ title: 1 })
        //titl=data.title
        // for(let i=0;i<data.length;i++){

        //     var text = data[i].title
        //     .split(' ')
        //     .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        //     .join(' ');   
        //     titl=text
        // }
        // console.log(titl)
        if (data.length == 0) { return res.status(400).send({ status: false, message: "Sorry No Books Found" }) }
        else { return res.status(200).send({ status: true, message: "Books list", data: data }) }
    } catch (err) {
        console.log("This is the error:", err.message)
        res.status(500).send({ message: "Error", error: err.message })
    }
}


//——————————————————————————————Delete Books———————————————————————————————————————

const deleteBooks = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, messsage: "Pls Enter bookId in Valid Format" })
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


//—————————————————————————————— getBooksByParamsId———————————————————————————————————————

const getBooksByParamsId=async function(req,res){
    const iD= req.params.bookId
    if(!isValidObjectId(iD)) return res.status(400).send({status:false,message:"Pls Enter BookId In Valid Format"})
    if(await userModel.findById(iD)) return res.status(400).send({status:false,message:"Dont Add UserId Add Only BookId"})
    if(await reviewModel.findById(iD)) return res.status(400).send({status:false,message:"Dont Add ReviewId Add Only BookId"})
    if(!(await booksModel.findOne({$and:[{_id:iD,isDeleted:false}]}))) return res.status(400).send({status:false,message:"This Id Doesnot Exists"})


    let bookData=await booksModel.findById(iD).select({ISBN:0,deletedAt:0,__v:0}).lean()
    let reviewData=await reviewModel.find({bookId:iD}).select({reviewedBy:1,bookId:1,reviewedAt:1,rating:1,review:1})
    bookData.reviewsData=reviewData
    res.status(200).send({status:true,message: 'Books list',data:bookData})
}



module.exports = {createBooks,getBooks,getBooksByParamsId,updateBooks}
