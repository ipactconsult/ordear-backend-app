const mongoose = require('mongoose')
const FranchiseSchema =  mongoose.Schema({
    Franchise_name:String,
    
})
module.exports= new mongoose.model('franchiseAccounts',FranchiseSchema)