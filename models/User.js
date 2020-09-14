const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User