const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({

    title: { type: String, required: true, unique: true, trim: true, lowercase: true },

    excerpt: { type: String, required: true, trim: true },

    userId: { type: ObjectId, ref: 'User' },

    ISBN: { type: String, required: true, unique: true },

    category: { type: String, required: true, trim: true, lowercase: true },

    subcategory: { type: [String], required: true, lowercase: true },

    reviews: { type: Number, default: 0, comment: Number },

    deletedAt: Date,
    bookCover:String,

    releasedAt: { type: Date, required: true },

    isDeleted: { type: Boolean, default: false }
    
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema)



  
  
