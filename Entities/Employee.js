const mongoose = require('mongoose')
const UserSchema = new  mongoose.Schema({
    username : String,
    email : String,
    password : String,
    phone : String,
    address:String,
    image:String,
    role : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts'   
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurants'   
    },
    Franchise:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'franchiseAccounts'   
    }
})
module.exports=  mongoose.model('users',UserSchema)