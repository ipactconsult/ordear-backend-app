const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: null,
      },
    firstName : {type: String, required:true,},
    lastName : {type: String, required:true,},
    adresse : {type: String},
    phone : {type: String,default:"", trim:true, unique:true},
    email : {type: String, required:true, trim:true, unique:true},
    password:{type:String, required:true},   
    //avatar: {type:String, default:""},
    birthday: {type:String, default:""},
    genre: {type:String, default:""},
    resetLink:{type:String, default:""},
    source: { type: String, required: [false, "source not specified"] },
    lastVisited: { type: Date, default: new Date() }
  });
const User = mongoose.model("user",userSchema)
module.exports = User;