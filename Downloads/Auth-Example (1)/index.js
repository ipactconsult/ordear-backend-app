const PORT = process.env.PORT || 5000
const express = require("express")
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const cors = require ('cors');
const userRoute=require('./routes/UserRoutes/UserRouter');
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup=require('./passport')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const fs = require('fs');

const path = require('path')
require('dotenv').config()
const app = express();
app.use(cookieParser('MY SECRET'));
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser : true,

}, (err)=> {
  if(err) throw err;
  console.log("MongoDB connection established");
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);



app.use(express.json());
app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app
  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use("/api",userRoute);
