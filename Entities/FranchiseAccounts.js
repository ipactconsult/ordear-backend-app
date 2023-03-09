const mongoose = require('mongoose')
const FranchiseSchema = new mongoose.Schema({
    Franchise_name:String,
    Belongs_to:{
        types:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
})
module.exports=mongoose.model('FranchiseAccounts',FranchiseSchema)