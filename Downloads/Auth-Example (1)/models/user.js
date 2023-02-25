const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name : {type: String, required:true, trim:true},
    country : {type: String, required:true, trim:true},
    phone : {type: String, required:true, trim:true, unique:true},
    email : {type: String, required:true, trim:true, unique:true},
    password:{type:String, required:true},
    role:{type:String, default:""},
    avatar: {type:String, default:""},
    resetLink:{type:String, default:""},
    birthday:{type: Date, default:""},
    bio : {type : String, default: ''},
});
const User = mongoose.model("user",userSchema)
module.exports = User;