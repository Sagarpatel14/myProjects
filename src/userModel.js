const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    fname: {
        type: string,
        required: true
    },
    lname: {
        type: string,
        required: true
    },
    email: {
        type: string,
        required: true,
        unique: true
    },
    profileImage: { type: string, required: true }, // s3 link
    phone: {
        type: string,
        required: true,
        unique: true
    },
    password: { type: string, required: true, minLen: 8, maxLen: 15 }, // encrypted password
    address: {
        shipping: {
            street: { type: string, required: true },
            city: { type: string, required: true },
            pincode: { type: number, required: true }
        },
        billing: {
            street: { type: string, required: true },
            city: { type: string, required: true },
            pincode: { type: number, required: true }
        }
    },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema)
