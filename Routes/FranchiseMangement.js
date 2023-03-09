const exp=require('express')
const route=exp.Router()
const FranchiseAccounts=require('../Entities/FranchiseAccounts')
route.post('/add_Franchise',async(req,res)=>{
    FranchiseAccounts.create({
        Franchise_name:req.body.FranchiseName,  
       
    },(err,docs)=>{if(err) res.send(err) 
        else res.send(docs)})
})
route.get('/list',(req,res)=>{
    FranchiseAccounts.find({},(err,docs)=>{
        if(err) res.send(err)
        else res.send(docs)
    })
})
module.exports=route