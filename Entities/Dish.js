const mongoose = require('mongoose')
const DishSchema = new mongoose.Schema({
    dishName : String,
    ingredient: [{
        types:mongoose.Schema.Types.ObjectId,
        ref:'ingredients'
    }],
    dishPrice:Number,
    Category:{
        types:mongoose.Schema.Types.ObjectId,
        ref:'categories'
    },
    Assigned_to:{
        types:mongoose.Schema.Types.ObjectId,
        ref:'posts'
    }
})
module.exports=mongoose.model('dishes',DishSchema)