const mongoose = require('mongoose');
const validator = require('validator')

const authorSchema = new mongoose.Schema( {
  
     fname: {
        type : String,
        required : true
     }, 
     lname: {
        type : String,
        required : true
     }, 
     title: {
        type : String,
        enum : ['Mr', 'Mrs', 'Miss']
     },
      email: {
        type : String,
        required : true,
        unique : true,
        validate : {
         validator : validator.isEmail,
         message : "Not a valid email",
         isAsync: false
        }
      },  
      password: {
        type : String,
        required : true
      }

},{ timestamps: true });

module.exports = mongoose.model('Author', authorSchema)