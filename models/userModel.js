const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ],
    },
    codeforces_handle: {
        type: String,
        default: "cf"
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,

    },
    googleId: { type: String },
})

module.exports = mongoose.model('user', userSchema);