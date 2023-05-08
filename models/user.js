const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, index: {unique: true}},
    reset_email: {type: String, index: {unique: true, sparse: true}},
    username: {type: String, index: {unique: true}},
    password: {type: String},
    prev_password: {type: String},
    name: String,
    initials: String,
    dp: {
        s: String,
        m: String
    },
    type: { type: String, enum: ['admin', 'editor', 'normal', 'verified', 'blocked', 'invited'], default: 'normal'},
    city: String,
    country: String,
    sex: { type: String, enum: ['M', 'F', 'O']},
    phone: Number,
    about: String,
    job: {
        title: String,
        org: String
    },
    age: Number,
    theme: { type: String, enum: ['auto', 'light', 'dark'], default: 'auto'},
    layout: { type: String, enum: ['auto', 'grid'], default: 'auto'},
    consent: {type: Boolean, default: false},
    accountCreated: {type: Date, default: Date.now},
    loginAttempts: {type: Number, required: true, default: 0},
    lockUntil: {type: Number},
    requestToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    hasNotification: {type: Boolean, default: false},
});

module.exports = mongoose.model('users',userSchema);