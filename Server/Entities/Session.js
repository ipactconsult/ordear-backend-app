const mongoose = require('mongoose')
const SessionSchema = new mongoose.Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
    ref:'customers'
    },
    token_parsed : String,
    init_time : Date,
    expire : Date,
})
module.exports=mongoose.model('sessions',SessionSchema)

