const mongoose = require('mongoose')
const employeeSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    phone : String,
    address:String,
    image:String,
})
module.exports=mongoose.model('employees',employeeSchema)