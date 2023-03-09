var nodemailer = require('nodemailer');
const express= require('express')
var bcrypt=require('bcryptjs')
var CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const route=express.Router();
/***************************************email broadcast *********************************************/
route.get('/send_mail/:email/:subject',(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'baissahmed@gmail.com',
          pass: 'crxxmebbhxnbatdd'
        }
      });
      
      var mailOptions = {
        from: 'baissahmed@gmail.com',
        to: req.params.email,
        subject: req.params.subject,
        text: req.body.text
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          res.send('Email sent: ' + info.response);
        }
      });
})
/***************************************email validation *********************************************/
route.post('/validate/:email/:subject',(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'baissahmed@gmail.com',
          pass: 'crxxmebbhxnbatdd'
        }
      });
      console.log(req.body.password)
      var hash = CryptoJS.SHA256(req.params.email+req.body.password)
        
        let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
        let data = {
            time: Date(),
            Email:req.params.email,
           // iss:hash
        }
        let  init_time=new Date(Date.now())
        let  auth_token_expire=new Date(Date.now()+(0.01)*3600000)
        const auth_token = jwt.sign(data, jwtSecretKey);
        console.log(auth_token)
        console.log("expire=>"+auth_token_expire)
      var link="http://localhost:8000/customers/login/"+req.params.email+"/"
      var mailOptions = {
        from: 'baissahmed@gmail.com',
        to: req.params.email,
        subject: req.params.subject,
        text: req.body.text,
        html:
        '<h1>this is your authorization token</h1>'+
        '<p>'+auth_token+'</p>'+
        ' <form action="'+link+'"'+ 'method="POST" > '+
        ' <input type="password" value="'+req.body.password+'"' +'id="password" name="password" placeholder="Enter password" style="display:none"> '+
        ' <input type="text" value="'+auth_token+'"' +'id="auth_token" name="auth_token"  style="display:none"> '+
        ' <input  value="'+auth_token_expire+'"' +'id="auth_token_expire" name="auth_token_expire"  style="display:none"> '+ 
        ' <input type="submit" value="Submit"></form> '
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          res.send('Email sent: ' + info.response);
        }
      });
})
/***************************************************Account validation for employees**********************************************************/
route.post('/validateEmployee/:email/:subject',(req,res)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'baissahmed@gmail.com',
          pass: 'crxxmebbhxnbatdd'
        }
      });
      console.log(req.body.password)
      var hash = CryptoJS.SHA256(req.params.email+req.body.password)
        
        let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
        let data = {
            time: Date(),
            Email:req.params.email,
           // iss:hash
        }
        let  init_time=new Date(Date.now())
        let  auth_token_expire=new Date(Date.now()+(0.01)*3600000)
        const auth_token = jwt.sign(data, jwtSecretKey);
        console.log(auth_token)
        console.log("expire=>"+auth_token_expire)
      var link="http://localhost:8000/employees/login_employee/"+req.params.email+"/"
      var mailOptions = {
        from: 'baissahmed@gmail.com',
        to: req.params.email,
        subject: req.params.subject,
        text: req.body.text,
        html:
        '<h1>this is your authorization token</h1>'+
        '<p>'+auth_token+'</p>'+
        ' <form action="'+link+'"'+ 'method="POST" > '+
        ' <input type="password" value="'+req.body.password+'"' +'id="password" name="password" placeholder="Enter password" style="display:none"> '+
        ' <input type="text" value="'+auth_token+'"' +'id="auth_token" name="auth_token"  style="display:none"> '+
        ' <input  value="'+auth_token_expire+'"' +'id="auth_token_expire" name="auth_token_expire"  style="display:none"> '+ 
        ' <input type="submit" value="Submit"></form> '
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          res.send('Email sent: ' + info.response);
        }
      });
})
/********************************************************************************************************************************/
route.post('/api_mobile/send_mail/:email/:subject',(req,res)=>{
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'donia.zidi.dz@gmail.com',
        pass: 'vzxawfjnnpzkijpu'
      }
    });
    console.log("password=>",req.body.password)

    var hash = CryptoJS.SHA256(req.params.email+req.body.password)
    let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
     const random = Math.floor(Math.random() * 9000 + 1000);
      const password = req.body.password;
      const email = req.params.email;
      console.log(random);
    
    var mailOptions = {
      from: 'donia.zidi.dz@gmail.com',
      to: req.params.email,
      subject: req.params.subject,
      text: req.body.text,
      html:'<h1>code</h1>'+
           '<p>'+random+'</p>' +
           '<p>'+password+'</p>' +
           '<p>'+email+'</p>'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        res.send('Email sent: ' + info.response);
      }
    });
})
/***************************************************Account validation for employees**********************************************************/
route.post('/validateResp/:email/:subject',(req,res)=>{
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'baissahmed@gmail.com',
        pass: 'crxxmebbhxnbatdd'
      }
    });
    console.log("password=>",req.body.password)
    var hash = CryptoJS.SHA256(req.params.email+req.body.password)
      
      let jwtSecretKey = hash.toString(CryptoJS.enc.Base64);
      let data = {
          time: Date(),
          Email:req.params.email,
         // iss:hash
      }
      let  init_time=new Date(Date.now())
      let  auth_token_expire=new Date(Date.now()+(0.01)*3600000)
      const auth_token = jwt.sign(data, jwtSecretKey);
      console.log(auth_token)
      console.log("expire=>"+auth_token_expire)
    var link="http://localhost:8000/resp/login_as_a_franchise_responsible/"+req.params.email+"/"
    var mailOptions = {
      from: 'baissahmed@gmail.com',
      to: req.params.email,
      subject: req.params.subject,
      text: req.body.text,
      html:
      '<h1>this is your authorization token</h1>'+
      '<p>'+auth_token+'</p>'+
      ' <form action="'+link+'"'+ 'method="POST" > '+
      ' <input type="password" value="'+req.body.password+'"' +'id="password" name="password" placeholder="Enter password" style="display:none"> '+
      ' <input type="text" value="'+auth_token+'"' +'id="auth_token" name="auth_token"  style="display:none"> '+
      ' <input  value="'+auth_token_expire+'"' +'id="auth_token_expire" name="auth_token_expire"  style="display:none"> '+ 
      ' <input type="submit" value="Submit"></form> '
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        res.send('Email sent: ' + info.response);
      }
    });
})
module.exports=route
