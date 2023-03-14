var nodemailer = require('nodemailer');
const express= require('express')
var bcrypt=require('bcryptjs')
var CryptoJS=require('crypto-js')
var jwt=require('jsonwebtoken')
const route=express.Router();
const MailingController = require('../controllers/Mailing')
route.get('/send_mail/:email/:subject',MailingController.Mailing)
route.post('/validate/:email/:subject',MailingController.validate_customer)
route.post('/validateEmployee/:email/:subject',MailingController.validateEmployee)
route.post('/validateResp/:email/:subject',MailingController.validateResponsible)
module.exports=route
