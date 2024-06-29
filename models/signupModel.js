const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    EmpId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
        trim: true
    },
    DateOfBirth: {
        type: Date,
        required: true,
    },
    ProfileImg : {
        type : String,
        required : false
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("register", signupSchema);