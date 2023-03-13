const mongoose=require('mongoose')
const postSchema= mongoose.Schema({
  post:String,
  
})
module.exports=mongoose.model('posts',postSchema)