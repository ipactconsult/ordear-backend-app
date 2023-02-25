const PORT = process.env.PORT || 5000
const express = require("express")
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const cors = require ('cors');
const userRoute=require('./routes/UserRoutes/UserRouter');

//import readFileSync from 'fs';
const fs = require('fs');

const path = require('path')
require('dotenv').config()
const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser : true,

}, (err)=> {
  if(err) throw err;
  console.log("MongoDB connection established");
});

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


app.use(express.json());
app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use("/api",userRoute);
