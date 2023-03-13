const mongoose = require('mongoose')
const PhotoSchema = mongoose.Schema({
    executor : {
        types:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    image_url:String
   
})
module.exports=mongoose.model('ExecutorPhotos',PhotoSchema)