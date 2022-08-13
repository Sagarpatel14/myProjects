const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    quantity : {
        type : Number,
        require : true
    },
    price : {
        type : Number,
        require : true
    },
    amount : {
        type : Number
    }

},{ timestamps: true })

module.exports = mongoose.model('Product', productSchema)