const exp=require('express')
const route=exp.Router()
const customers=require('../Entities/Customer')
var bcrypt=require('bcryptjs')
var CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const sessions = require('../Entities/Session')
const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const express_session = require('express-session')

const register = async(req,res)=>{
    var salt = bcrypt.genSaltSync(10);
customers.create({
    username:req.body.username,
    email:req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    phone:req.body.phone,
    image:req.body.image,
    address:req.body.address
},(err,docs)=>{
    if(err){
        res.send(err)       
    }
    else res.send(docs)
})
};
const Login = async(req,res)=>{
    var salt = bcrypt.genSaltSync(10);  
customers.find({  
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
        else { console.log("password=>",req.body.password)
       if( bcrypt.compareSync(req.body.password, docs[0].password)==true)
       {
        
        var hash = CryptoJS.SHA256(req.params.email+req.params.password)
        
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
                user:data.Username,
                token_parsed:token,
                init_time:init_time,
                expire:expire
            })
            res.redirect('http://localhost:3000/login_as_customer?q='+token)
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
};
const Get_Authenticated_User=async(req,res)=>{
    sessions.find({token_parsed:req.body.token},(err,docs)=>{
        if(err)
         res.send(err)
         else {
            console.log(docs)
            res.send(docs)
         }
    })
}
const Google_Auth_Welcome = passport.authenticate('google', { scope:
    [ 'email', 'profile' ] }
)
const Google_Auth_CallBack = passport.authenticate( 'google', {
    successRedirect: '/customers/auth/google/dashboard',
    failureRedirect: '/login'
})
const GoogleAuthSignIn = (req, res) => {
    customers.find({email:req.user.email},(err,docs)=>{
        if(err) {res.send(err)}
        else {
            console.log("docs=>",docs)
            if(docs.length==0)
            {
                var salt = bcrypt.genSaltSync(10);
                customers.create({
                    username:req.user.displayName,
                    email:req.user.email,
                    password: bcrypt.hashSync("123456789", salt), 
                    phone:0,
                    address:"",
                    image:req.user.picture
                },(err,docs)=>{
                    if(err){
                        res.send(err)       
                    }
                    else { 
                        console.log(docs)
                        var hash = CryptoJS.SHA256(docs.email+docs._id+docs.username)
                        let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
                        let data = {
                            time: Date(),
                            Email:docs.email,
                            Username:docs._id,
                           
                        }
                        const token = jwt.sign(data, jwtSecretKey);
                        console.log(token)
                        sessions.create({
                            user:data.Username,
                            token_parsed:token,
                            init_time:new Date(Date.now()),
                            expire: new Date(Date.now()+8*3600000)
                        },(err,reslt)=>{
                            if(err ) res.send(err)
                            else res.redirect('http://localhost:3000/login_as_customer?q='+reslt[0].token_parsed)
                        })

                     }
                })          
            }
            else {
                console.log(docs)
                sessions.updateOne( 
                    { "user" : docs[0]._id },
                    {$set:{"init_time":Date.now(),"expire": new Date(Date.now()+8*3600000)}}
                  
                  ,(err,result)=>{
                    if(err) res.send(err)
                    sessions.find({user:docs[0]._id},(err,docs)=>{
                        if(err) res.send(err)
                        else {
                            console.log(docs)
                            res.redirect('http://localhost:3000/login_as_customer?q='+docs[0].token_parsed)
                        }
                    })})
            }
        }
    })
}
const set_Password =  async(req,res)=>{
    var salt = bcrypt.genSaltSync(10);
       customers.updateOne(
        { "email": req.params.email}, // Filter
        {$set:{"password":  bcrypt.hashSync(req.body.password, salt)}} // Update
    )
    .then((obj) => {
        console.log('Updated - ' + obj);
        res.send(obj)
    })
    .catch((err) => {
        console.log('Error: ' + err);
    })
};
const View_Profile = async(req,res)=>{
    customers.find({_id:req.params.id},(err,docs)=>{
        if(err)
        {
            res.send(err)

        }
        else {
            res.send(docs)
        }
    })
};
const Edit_Profile = async(req,res)=>{
    sessions.find({user:req.params.id},(err,docs)=>{
        if(err){
            res.send(err)     
        }
        else {
            if(docs[0].length==0)
            {
                res.send("you must activate your account by validating your email")
            }
            else {
                    customers.updateOne(
                        { "_id": req.params.id}, // Filter
                        {$set:{"phone":req.body.phone,"address":req.body.address,"image":req.body.image}} // Update
                    )
                    .then((obj) => {
                        console.log('Updated - ' + obj);
                        res.send(obj)
                    })
                    .catch((err) => {
                        console.log('Error: ' + err);
                    })
            }
        }
    })  
};
const LogOut=(req,res) => {
    req.logOut()
    res.redirect("/login")
    console.log(`-------> User Logged out`)
}
module.exports={
 register,
 Login,
 Get_Authenticated_User,
 Google_Auth_Welcome,
 Google_Auth_CallBack,
 GoogleAuthSignIn,
 set_Password,
 View_Profile,
 Edit_Profile,
 LogOut
}