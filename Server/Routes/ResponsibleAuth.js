
const exp=require('express')
const route=exp.Router()
const users=require('../Entities/User')
var bcrypt=require('bcryptjs')
var CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const sessions = require('../Entities/UserSession')
const Post = require('../Entities/Post')
const { session } = require('passport')
const ResponsibleAuthController=require('../controllers/ResponsibleAuthentication')
route.post('/add_franchise_responsible',ResponsibleAuthController.AddFranchiseResponsible)
route.post('/Login/:email',ResponsibleAuthController.Login)
route.post('/login_as_a_franchise_responsible/:email',ResponsibleAuthController.Responsible_Login)
route.post('/add_restaurant_responsible',ResponsibleAuthController.AddResponsibleRestaurant)
route.put("/set_password/:id",ResponsibleAuthController.setPassword)  
route.post("/auth_employee",ResponsibleAuthController.Get_Authenticated_User)                    
                
module.exports=route