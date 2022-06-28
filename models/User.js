const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Userschema = new Schema({
    name: String,
    email: String,
    password: String,
    dateofBirth: Date
})

const User = mongoose.model('User', Userschema);
 
module.exports = User;