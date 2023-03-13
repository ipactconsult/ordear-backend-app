const mongoose = require('mongoose')
const CustomerSchema = new mongoose.Schema({
    username : String,
    email    : String,
    password : String,    
    phone    : String,
    image    : String,
    address  : String,
})
module.exports=mongoose.model('customers',CustomerSchema)