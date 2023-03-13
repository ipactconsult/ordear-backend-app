const mongoose = require('mongoose')
const RestaurantSchema =  mongoose.Schema({
    restaurant_name:String,
    restaurant_address:String,
    phone:String,
    QrCode:String,
    Franchise:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'FranchiseAccounts'
    }
})
module.exports=mongoose.model('Restaurants',RestaurantSchema)