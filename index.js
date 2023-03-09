const express = require('express')
const app=express()
const mongoose=require("mongoose")
app.use(express.json())
const AuthRoutes= require("./Routes/Auth")
const MailRoutes= require("./Routes/Mailing")
const addPost = require('./Routes/PostMangment')
const addRestaurant =require('./Routes/RestaurantManagment')
const addEmployee =require('./Routes/EmployeeManagment')
const api_mobile =require('./Routes/Mailing')
const SignIn =require('./Routes/ResponsibleAuth')
const Login=require('./Routes/ResponsibleAuth')
const setPassword=require('./Routes/ResponsibleAuth')
const view_profile=require('./Routes/EmployeeManagment')
const getUser =require('./Routes/EmployeeManagment') 
const forgotPass =require('./Routes/ResponsibleAuth') 
const codePass =require('./Routes/ResponsibleAuth') 
const paymentRoutes = require("./Routes/Payment")
const { createProxyMiddleware } = require('http-proxy-middleware');
const port= 4000
const cookieParser = require("cookie-parser");



//mongoose.set('strictQuery', false);
//const stripe = require('stripe')('sk_test_51LUDGrHuLe1yv6a4UBoCLPlC1xSoytXNTHfyGfgnulPSIqs0DwpmzFzC0gGIQMAdvkICktNLrEUa0eo4AkP2MADb00jjrDSn87');
mongoose.connect('mongodb+srv://donia:203JFT0038@ordear1.chubbxc.mongodb.net/?retryWrites=true&w=majority').then((res)=>{
  console.log("MongoDB connected" )
}).catch((err)=>{
  console.log("not connected")
})


require('dotenv').config()
app.use(express.json());
app.use(cookieParser());
//app.use(express.urlencoded());
app.use('/employees',require('./Routes/EmployeeManagment'),createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }))
app.use('/customers',AuthRoutes,createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }))
app.use('/mail',MailRoutes,createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }))
app.use('/customer_payments',paymentRoutes,createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }))
app.use('/images',require('./Routes/uploadroutes'),createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }))
app.use('/restaurant',require('./Routes/RestaurantManagment'),createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }))
app.use(addPost)
app.use(addRestaurant)
app.use(addEmployee)
app.use(api_mobile)
app.use(SignIn)
app.use(Login)
app.use(setPassword)
app.use(view_profile)
app.use(getUser)
app.use(forgotPass)
//app.use(codePass)
app.use('/posts',require('./Routes/PostMangment'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/resp',require('./Routes/ResponsibleAuth'),createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }))
app.listen(port, async() => {
    console.log(`http://localhost:${port}`) 
  })
  