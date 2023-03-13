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
const CustomerAuthenticationController= require ('../controllers/CustomerAuthentication')
const path = require('path')
const process=require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const GOOGLE_CLIENT_ID = process.parsed.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.parsed.GOOGLE_CLIENT_SECRET
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
    callbackURL: "http://localhost:8000/customers/auth/google/callback",
    passReqToCallback   : true
  }, authUser));

  passport.serializeUser( (user, done) => { 
    console.log(`\n--------> Serialize User:`)
    console.log(user)
    done(null, user)
} )
passport.deserializeUser((user, done) => {
        console.log("\n--------- Deserialized User:")
        console.log(user)
        done (null, user)
}) 
checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    res.redirect("/login")
  }
route.post('/register',CustomerAuthenticationController.register)
route.post('/login/:email',CustomerAuthenticationController.Login)
route.post('/get_authentified_user/',CustomerAuthenticationController.Get_Authenticated_User)
route.get('/auth/google',CustomerAuthenticationController.Google_Auth_Welcome);
route.get('/auth/google/callback',CustomerAuthenticationController.Google_Auth_CallBack);
route.get("/auth/google/dashboard", checkAuthenticated, CustomerAuthenticationController.GoogleAuthSignIn)
route.put("/auth/google/set_password/:email",CustomerAuthenticationController.set_Password)
route.get("/view_profile/:id",CustomerAuthenticationController.View_Profile)
route.put("/edit_profile/:id",CustomerAuthenticationController.Edit_Profile)
route.post("/logout",CustomerAuthenticationController.LogOut)
module.exports=route