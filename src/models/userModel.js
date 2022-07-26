const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true,
        lowercase: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        lowercase: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    profileImage: {
        type: String,
        required: true,
        lowercase: true,
        trim:true
    }, // s3 link
    phone: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
        minLen: 8,
        maxLen: 15,
        trim:true
    }, // encrypted password
    address: {
        shipping: {
            street: { type: String, required: true, lowercase: true,trim:true },
            city: { type: String, required: true, lowercase: true,trim:true },
            pincode: { type: Number, required: true, lowercase: true,trim:true }
        },
        billing: {
            street: { type: String, required: true, lowercase: true,trim:true },
            city: { type: String, required: true, lowercase: true,trim:true },
            pincode: { type: Number, required: true, lowercase: true,trim:true }
        }
    },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)
