const mongoose = require('mongoose')


const menuSchema =  mongoose.Schema({
    nameFR: String,
    nameAng: String,
    Restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurant'
    }
},{versionKey:false ,timestamps: true})
module.exports=mongoose.model('Menu',menuSchema)