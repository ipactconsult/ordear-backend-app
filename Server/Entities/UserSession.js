const mongoose = require('mongoose')
const userSessionSchema = new mongoose.Schema({
    employee : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    token_parsed : String,
    init_time : Date,
    expire : Date,
})
module.exports=mongoose.model('user_sessions',userSessionSchema)

