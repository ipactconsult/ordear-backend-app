const posts=require('../Entities/Post')
const addPost = async(req,res)=>{
    posts.create({
        post:req.body.post,  
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
}
const display =async(req,res)=>{
    posts.find({
       
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
}
const retrieve  = async(req,res)=>{
    posts.find({
       'id':req.params.id
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
}
const Edit  = async(req,res)=>{
    posts.updateOne(
        { "_id": req.params.id}, // Filter
        {$set:{"post":req.body.post}} // Update
    )
    .then((obj) => {
        console.log('Updated - ' + obj);
        res.send(obj)
    })
    .catch((err) => {
        console.log('Error: ' + err);
    })
}
module.exports={
    addPost,display,retrieve,Edit
}
