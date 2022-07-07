const { default: mongoose } = require('mongoose');
const booksModel = require('../models/booksModel')
const userModel = require('../models/userModel')
const {isValid,isValidIsbn, isValidDate,isValidObjectId,isValidBody} = require('../validation/validation')

//——————————————————————————————Create Books———————————————————————————————————————
const createBooks = async function (req, res) {
    try {
        let data = req.body;
        let {title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;

        if(isValidBody(data)) return res.status(400).send({status : false, message : 'please enter body'})

        if(!("title" in data)) return res.status(400).send({status:false,message:"Pls Enter Title, Its Required"})
        if(!("excerpt" in data)) return res.status(400).send({status:false,message:"Pls Enter excerpt, Its Required"})
        if(!("ISBN" in data)) return res.status(400).send({status:false,message:"Pls Enter ISBN, Its Required"})
        if(!("category" in data)) return res.status(400).send({status:false,message:"Pls Enter category, Its Required"})
        if(!("subcategory" in data)) return res.status(400).send({status:false,message:"Pls Enter subcategory, Its Required"})
        if(!("releasedAt" in data)) return res.status(400).send({status:false,message:"Pls Enter releasedAt, Its Required"})
        

        if(!isValid(title)) return res.status(400).send({status : false, message : 'Dont left title Empty'})
        if(!isValid(excerpt)) return res.status(400).send({status : false, message : 'Dont left Excerpt Empty'})
        if(!isValid(userId)) return res.status(400).send({status : false, message : 'Dont left UserId Empty'})
        if(!isValid(ISBN)) return res.status(400).send({status : false, message : 'Dont left Excerpt Empty ISBN'})
        if(!isValid(category)) return res.status(400).send({status : false, message : 'please enter category Dont left Empty'})
        if(!isValid(subcategory)) return res.status(400).send({status : false, message : 'please enter subcategory Dont left Empty'})
        if(!isValid(releasedAt)) return res.status(400).send({status : false, message : 'please enter release date Dont left Empty'})
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
//—————————————————————————————— Get Books———————————————————————————————————————
const getBooks= async function(req,res){
try{    
    const query=req.query
    const{userId,category,subcategory}=query

    const filter={isDeleted:false}
    if(userId){
        if(!isValidObjectId(userId))return res.status(400).send({status:false,messsage:"Pls Enter UserId in Valid Format"})
        if(await booksModel.findOne({_id:userId})) return res.status(400).send({status:false,message:"Dont Give BookId Give only UserId"})
        if(!(await userModel.findById(userId))) return res.status(400).send({status:false,message:"This UserId DoesNot Exists"})
        filter.userId=userId
    }
    if(category){
        if(!isValid(category)) return res.status(400).send({status:false,message:"Dont Left Category Empty"})
        filter.category=category.trim()
    }
    if(subcategory){
        if(!isValid(subcategory)) return res.status(400).send({status:false,message:"Dont Left subcategory Empty"})
        filter.subcategory={$all:subcategory.trim().split(",").map(e=>e.trim())}
    }
    let data=await booksModel.find(filter).sort({title:1})
    //titl=data.title
    // for(let i=0;i<data.length;i++){

    //     var text = data[i].title
    //     .split(' ')
    //     .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    //     .join(' ');   
    //     titl=text
    // }
    // console.log(titl)
    if(data.length==0) {return res.status(400).send({status:false,message:"Sorry No Books Found"})}
    else{return res.status(200).send({status:true,message:"Books list",data:data})}
}
catch(err){
    res.status(500).send({status:false,message:err.message})
}
}
module.exports = {createBooks,getBooks}



//—————————————————————————————— update-Books———————————————————————————————————————

