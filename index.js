const express = require('express')
const app=express()
const mongoose=require("mongoose")
app.use(express.json())
const AuthRoutes= require("./Routes/Auth")
const MailRoutes= require("./Routes/Mailing")
const paymentRoutes = require("./Routes/Payment")
const { createProxyMiddleware } = require('http-proxy-middleware');
const port= 8000
//mongoose.set('strictQuery', false);
const stripe = require('stripe')('sk_test_51LUDGrHuLe1yv6a4UBoCLPlC1xSoytXNTHfyGfgnulPSIqs0DwpmzFzC0gGIQMAdvkICktNLrEUa0eo4AkP2MADb00jjrDSn87');
mongoose.connect('mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net/Ordear_DB').then((res)=>{
  console.log("connected to mongodb+srv://ahmed:ahmed@cluster0.iaanx.mongodb.net/Ordear_DB?retryWrites=true&w=majority")
}).catch((err)=>{
  console.log("not connected")
})
app.use(express.json());
app.use(express.urlencoded());
app.use('/employees',require('./Routes/EmployeeManagment'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/customers',AuthRoutes,createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/mail',MailRoutes,createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/customer_payments',paymentRoutes,createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/images',require('./Routes/uploadroutes'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/restaurant',require('./Routes/RestaurantManagment'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/posts',require('./Routes/PostMangment'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/resp',require('./Routes/ResponsibleAuth'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))
app.use('/franchises',require('./Routes/FranchiseMangement'),createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))

app.listen(port, async() => {
    console.log(`http://localhost:${port}`) 
  })
  