const mongoose = require('mongoose')


const restaurantSchema =  mongoose.Schema({
    name: String,
    address: String,
    phone: Number,
    cuisineType:String,
    email:String,
    taxe:Number,
    color:String,
    logo:String,
    promotion:String,
    Franchise:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FranchiseAccounts'
    }
},{versionKey:false ,timestamps: true})
module.exports=mongoose.model('Restaurant',restaurantSchema)