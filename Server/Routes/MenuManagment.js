const exp=require('express')
const route=exp.Router()
const categories=require('../Entities/Category')
route.post('/add_category',async(req,res)=>{
    categories.create({
        category_name:req.body.category_name,  
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
})
module.exports=route