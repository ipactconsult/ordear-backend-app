const mongoose=require('mongoose')
const ingredientSchema= mongoose.Schema({
  ingredient_name:String,
  
})
module.exports=mongoose.model('ingredients',ingredientSchema)