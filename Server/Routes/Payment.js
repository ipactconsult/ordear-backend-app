const express = require('express')
const route = express.Router()

const path = require('path')
const process=require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const stripe = require('stripe')(process.parsed.StripeApi);
const PaymentController = require('../controllers/PaymentMethods')
route.post('/register_credit_card/:cus_name/:cus_email',PaymentController.addPaymentMethod)  
route.post('/list_cards/:cus_name/:cus_email',PaymentController.displayPaymentMethods)
route.post('/edit_card/:cus_email',PaymentController.EditPaymentMethods)
module.exports=route