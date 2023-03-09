const exp=require('express')
const route=exp.Router()
const posts=require('../Entities/Post')
route.post('/add_post',async(req,res)=>{
    posts.create({
        post:req.body.post,  
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
})
route.get('/get_posts',async(req,res)=>{
    posts.find({
       
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
})
route.get('/get_posts/:id',async(req,res)=>{
    posts.find({
       'id':req.params.id
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
})
module.exports=route