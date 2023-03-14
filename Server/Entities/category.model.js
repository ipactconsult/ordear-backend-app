const mongoose = require('mongoose')


const categorySchema =  mongoose.Schema({
    nameFR: String,
    nameAng: String,
    disponibility:Boolean,
    tdisponibilityDuration:Date,
    Menu:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu'
    }
},{versionKey:false ,timestamps: true})
module.exports=mongoose.model('Category',categorySchema)