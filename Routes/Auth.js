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
const { session } = require('passport')
/**************************************************sign up********************************************************/
route.post('/register',async(req,res)=>{
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
})
const GOOGLE_CLIENT_ID = "141515581267-msoo9a56g3igvevnkjp7g67eeh9nltht.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"


authUser = (request, accessToken, refreshToken,password, profile, done) => {
    return done(null, profile);
  }
console.log(authUser)
route.use(express_session({
    secret: "secret",
    resave: false,
    saveUninitialized: true 
}))
route.use(passport.initialize()) // init passport on every route call
route.use(passport.session())  
//Use "GoogleStrategy" as the Authentication Strategy
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/users/auth/google/callback",
    passReqToCallback   : true
  }, authUser));


passport.serializeUser( (user, done) => { 
    console.log(`\n--------> Serialize User:`)
    console.log(user)
    console.log(user.credentials)
     // The USER object is the "authenticated user" from the done() in authUser function.
     // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.  

    done(null, user)
} )
passport.deserializeUser((user, done) => {
        console.log("\n--------- Deserialized User:")
        console.log(user)
        console.log(user.credentials)
        // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
        // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

        done (null, user)
})
/**************************************************login********************************************************/ 
route.post('/login/:email',async(req,res)=>{
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
})
/**************************************************google passport authentied user ************************************************* */
route.post('/get_authentified_user/',async(req,res)=>{
    sessions.find({token_parsed:req.body.token},(err,docs)=>{
        if(err)
         res.send(err)
         else {
            console.log(docs)
            res.send(docs)
         }
    })
})
route.post('/register_with_twitter',async(req,res)=>{

})


/**************************************************google passport authentication sign-up ************************************************* */

route.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

route.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/users/auth/google/dashboard',
        failureRedirect: '/login'
}));
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}
/**************************************************google passport authentication sign-in ************************************************* */
route.get("/auth/google/dashboard", checkAuthenticated, (req, res) => {
    customers.find({email:req.user.email},(err,docs)=>{
        if(err) {res.send(err)}
        else {
            if(docs.length==0)
            {
                customers.create({
                    username:req.user.displayName,
                    email:req.user.email,
                    password: "",
                    phone:0,
                    address:"",
                    image:req.user.picture
                },(err,docs)=>{
                    if(err){
                        res.send(err)       
                    }
                    else res.send(docs)
                })          
            }
            else {
                res.send({user:req.user})
            }
        }
    })

 
})
/**************************edit password after google login ***********************************************/
route.put("/auth/google/set_password/:email",async(req,res)=>{
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
})

/**************************************************view profile*******************************************************/
route.get("/view_profile/:id",async(req,res)=>{
    customers.find({_id:req.params.id},(err,docs)=>{
        if(err)
        {
            res.send(err)

        }
        else {
            res.send(docs)
        }
    })
})
/***************************************************edit profile *****************************************************/
route.put("/edit_profile/:id",async(req,res)=>{
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
    
})
//Define the Logout
route.post("/logout", (req,res) => {
    req.logOut()
    res.redirect("/login")
    console.log(`-------> User Logged out`)
})
module.exports=route