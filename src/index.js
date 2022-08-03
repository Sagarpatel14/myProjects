const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const route = require('./route/route')


const app = express()
app.use(multer().any())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb+srv://imtiyaz786:ansari@imtiyazansari.mol1y.mongodb.net/Group30-db?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then(()=>console.log("mongoDB is connected"))
.catch((error)=>console.log(error))

app.use('/',route)

app.listen(process.env.PORT || 3000,function(){
    console.log("express app is running on PORT " + (process.env.PORT || 3000))
})

