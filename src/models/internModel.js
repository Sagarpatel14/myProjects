const mongoose = require('mongoose');
// const validator = require('validator')
let ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = new mongoose.Schema( {
    name :{
        type : String,
        required : true
    },
    email : {
        type :String,
        required : true,
        unique : true
    },
    mobile : {
        type : String,
        required : true,
        unique : true
    },
    collegeId :{
        type : ObjectId,
        ref : "College"
    },
    isDeleted : {
        type : Boolean,
        default : false
    }
},{ timestamps: true });

module.exports = mongoose.model('Intern', internSchema)

  
