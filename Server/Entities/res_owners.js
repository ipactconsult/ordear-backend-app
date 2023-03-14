const mongoose = require('mongoose')
const ownerSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    password:String,
})
module.exports=mongoose.model('owners',ownerSchema)