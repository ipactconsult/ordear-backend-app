const mongoose=require('mongoose')
const categorySchema= mongoose.Schema({
  category_name:String,
  
})
module.exports=mongoose.model('categories',categorySchema)