const express = require('express')
const app=express()
const mongoose=require("mongoose")
app.use(express.json())
app.use(express.urlencoded());
const port= 8000
const path = require('path')
const process=require('dotenv').config({ path: path.resolve(__dirname, './.env') });
//mongoose.set('strictQuery', false);
const GlobalRoutes= require('./Routes/Index')

let url = process.parsed.DATABASE_URL
mongoose.connect(url).then((res)=>{
  console.log("connected to DataBase")
}).catch((err)=>{
  console.log("not connected")
})

app.use(GlobalRoutes)
app.listen(port, async() => {
    console.log(`http://localhost:${port}`) 
  })
  