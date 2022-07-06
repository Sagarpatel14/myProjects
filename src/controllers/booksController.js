const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const {isValid,isValidIsbn, isValidDate,isValidObjectId,isValidBody} = require('../validation/validation')


const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let {title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if(isValidBody(data)) return res.status(400).send({status : false, message : 'please enter body'})

        if(!("title" in data)) return res.status(400).send({status:false,msg:"Pls Enter Title, Its Required"})
        if(!("excerpt" in data)) return res.status(400).send({status:false,msg:"Pls Enter excerpt, Its Required"})
        if(!("ISBN" in data)) return res.status(400).send({status:false,msg:"Pls Enter ISBN, Its Required"})
        if(!("category" in data)) return res.status(400).send({status:false,msg:"Pls Enter category, Its Required"})
        if(!("subcategory" in data)) return res.status(400).send({status:false,msg:"Pls Enter subcategory, Its Required"})
        if(!("releasedAt" in data)) return res.status(400).send({status:false,msg:"Pls Enter releasedAt, Its Required"})
        

        if(!isValid(title)) return res.status(400).send({status : false, message : 'please enter title'})
        if(!isValid(excerpt)) return res.status(400).send({status : false, message : 'please enter excerpt'})
        if(!isValid(userId)) return res.status(400).send({status : false, message : 'please enter userId'})
        if(!isValidObjectId(userId)) return res.status(400).send({status : false, message : 'please enter userId in valid format'})
        if(!isValid(ISBN)) return res.status(400).send({status : false, message : 'please enter ISBN'})
        if(!isValid(category)) return res.status(400).send({status : false, message : 'please enter category'})
        if(!isValid(subcategory)) return res.status(400).send({status : false, message : 'please enter subcategory'})
        if(!isValid(releasedAt)) return res.status(400).send({status : false, message : 'please enter release date'})
        if(!isValidIsbn(ISBN)) return res.status(400).send({status : false, message : 'please enter valid ISBN'})
        if(!isValidDate(releasedAt)) return res.status(400).send({status : false, message : "please enter the date in 'YYYY-MM-DD' format" })

        let usedTitle = await booksModel.findOne({title : title})
        if(usedTitle) return res.status(400).send({status : false, message : 'title already exist'})

        let usedIsbn = await booksModel.findOne({ ISBN: ISBN})
        if(usedIsbn) return res.status(400).send({status : false, message : 'ISBN already exist'})
        
        let checkUserId = await userModel.findById(userId)
        if(!checkUserId) return res.status(400).send({status : false, message : 'this user id does not exist'})

        let saveData = await booksModel.create(data)
        res.status(201).send({status : true, message : 'success', data : saveData})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({status : false, message : err.message})
    }
}

module.exports = {createBooks}