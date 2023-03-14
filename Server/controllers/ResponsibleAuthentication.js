const Post = require("../Entities/Post");
const users=require('../Entities/User')
var bcrypt=require('bcryptjs')
var CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const sessions = require('../Entities/UserSession')

const AddFranchiseResponsible = async(req,res)=>{
    Post.find({post:"Responsible_Franchise"},(err,docs)=>{
        if(err) res.send(err)
        else 
        {
            console.log(docs[0]._id)
            var salt = bcrypt.genSaltSync(15);
          users.create({
            username:req.body.username,
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password, salt),
            phone:req.body.phone,
            image:req.body.image,
            address:req.body.address,
            role:docs[0]._id,
            restaurant:req.body.restaurant,
            Franchise:req.body.Franchise
          },(err,docs)=>{
            if(err) res.send(err)
            else res.send(docs)
          })  
        }
    })
}
const Login = async(req,res)=>{
    var salt = bcrypt.genSaltSync(10);  
    users.find({  
        email:req.params.email,
        
    },(err,docs)=>{
        if(err){
            res.send(err)
            
        }
        else { 
             console.log(docs)
             if(docs.length==0)
             {
                res.send('not found')
             }
             else              {
                if( bcrypt.compareSync(req.body.password, docs[0].password)==true)
           {
            let user=docs
            console.log("found")
             // res.send("correct") 
              sessions.updateOne( 
                { "employee" : docs[0].id },
                {$set:{"init_time":Date.now(),"expire": new Date(Date.now()+8*3600000)}}
              
              ,(err,docs)=>{
                if(err) res.send(err)
                sessions.find({employee:user[0]._id},(err,docs)=>{
                    if(err) res.send(err)
                    else res.send(docs)
                })
               
              })
            }}}
           
          
        })
    }
    const Responsible_Login=async(req,res)=>{
        var salt = bcrypt.genSaltSync(10);  
        users.find({  
            email:req.params.email,
            
        },(err,docs)=>{
            if(err){
                res.send(err)
                
            }
            else { 
                 console.log(docs)
                 if(docs.length==0)
                 {
                    res.send('not found')
                 }
                 else if(docs.length!=0)
                 {
                    if(req.body.password==undefined)
                    { 
                        console.log('undefined')
                        res.send(500,'no password provided ')
                    }
                else { //console.log(req.body.password)
               if( bcrypt.compareSync(req.body.password, docs[0].password)==true)
               {
                var role = docs[0].role
                var hash = CryptoJS.SHA256(req.params.email+req.body.password)
                
                let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
                
                let data = {
                    time: Date(),
                    Email:docs[0].email,
                    Username:docs[0]._id,
                   // iss:hash
                }
              
                const token = jwt.sign(data, jwtSecretKey);
                console.log(token)
                let  init_time=new Date(Date.now())
                let expire=   new Date(Date.now()+8*3600000)
                console.log("init=>"+init_time)
                console.log("expire="+req.body.auth_token)
                console.log("expiredate="+req.body.auth_token_expire)
                if(init_time.getTime()>new Date(req.body.auth_token_expire).getTime()) {
                    res.send("token expired")
                }
                else {
                      
                    sessions.create({
                        employee:data.Username,
                        token_parsed:token,
                        init_time:init_time,
                        expire:expire
                    })
                    Post.find({_id:role},(err,docs)=>{
                        if(err)
                        console.log(err)
                        else { 
                         //   console.log(docs)
                        if(docs[0].post=="responsible_restaurant")
                        res.redirect('http://localhost:3000/login_as_restaurant_responsible?q='+token)
                        else if(docs[0].post=="Responsible_Franchise")
                        res.redirect('http://localhost:3000/login_as_franchise_responsible?q='+token)
                        else if(docs[0].post=="super-admin")
                        res.redirect('http://localhost:3000/login_as_super-admin?q='+token)
                        }
                    })
                    
                }
                // var token= hash.toString(CryptoJS.enc.Base64)
                
               }
               else 
               {
                res.send('incorrect credentials')
               }
            }
            }
        }
        })  
    }
    const AddResponsibleRestaurant=async(req,res)=>{
    
        Post.find({post:"responsible_restaurant"},(err,docs)=>{
            if(err) res.send(err)
            else 
            {
                console.log(docs[0]._id)
                console.log(req.body.password)
                var salt = bcrypt.genSaltSync(15);
              users.create({
                username:req.body.username,
                email:req.body.email,
                password: bcrypt.hashSync(req.body.password, salt),
                phone:req.body.phone,
                image:req.body.image,
                address:req.body.address,
                role:docs[0]._id,
                restaurant:req.body.restaurant
              },(err,docs)=>{
                if(err) { res.send(err) }
                else{ 
                res.send(docs)
                }
              })  
            }
        })      
     }
    const setPassword =  async(req,res)=>{  var salt = bcrypt.genSaltSync(10);
        var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if(req.body.password.matches(passw)){
            users.updateOne(
             { "_id": req.params.id}, // Filter
             {$set:{"password":  bcrypt.hashSync(req.body.password, salt)}} // Update
         )
         .then((obj) => {
             console.log('Updated - ' + obj);
             res.send(obj)
         })
         .catch((err) => {
             console.log('Error: ' + err);
         })}
         else {
             res.send("try another password")
         }
    
    }
    const Get_Authenticated_User = async(req,res)=>{
        sessions.find({token_parsed:req.body.token},(err,docs)=>{
            if(err)
             res.send(err)
             else {
                console.log(docs)
                res.send(docs)
             }
        })
    }
    
module.exports={
    AddFranchiseResponsible,Login,Responsible_Login,AddResponsibleRestaurant,setPassword,Get_Authenticated_User
}