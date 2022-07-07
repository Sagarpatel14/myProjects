const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
// {
//   bookId: {ObjectId, mandatory, refs to book model},
//   reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
//   reviewedAt: {Date, mandatory},
//   rating: {number, min 1, max 5, mandatory},
//   review: {string, optional}
//   isDeleted: {boolean, default: false},
// }

const reviewSchema = new mongoose.Schema(
    {
      bookId: {type: ObjectId, required: true, ref: "Book" },
  
      reviewedBy: {type: String, required: true, default: 'Guest',trim:true},
  
      reviewedAt: { type: Date ,required: true },
  
      rating: {type: Number, required: true, min:1,max:5},

      review: { type: String ,trim:true},

      isDeleted : {type: Boolean, default: false}

    },

    { timestamps: true }

  );
  
  module.exports = mongoose.model("Review", reviewSchema);