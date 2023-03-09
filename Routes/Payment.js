const express = require('express')
const route = express.Router()
const stripe = require('stripe')('sk_test_51LUDGrHuLe1yv6a4UBoCLPlC1xSoytXNTHfyGfgnulPSIqs0DwpmzFzC0gGIQMAdvkICktNLrEUa0eo4AkP2MADb00jjrDSn87');
/**add payment method+activate payment method */
route.post('/register_credit_card/:cus_name/:cus_email',async(req,res)=>{
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: req.body.number,
        exp_month: req.body.exp_month,
        exp_year: req.body.exp_year,
        cvc: req.body.cvc,
      },
    });
    console.log(paymentMethod)
    const customer = await stripe.customers.create({
      description: 'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
      name:req.params.cus_name,
      email:req.params.cus_email
    });
    const paymentMethod2 = await stripe.paymentMethods.attach(
      paymentMethod.id,
      {customer: customer.id}
    );
    
    res.send(paymentMethod2)
  
  })
  /***************************show payment details */
  route.post('/list_cards/:cus_name/:cus_email',async(req,res)=>{
    const customer = await stripe.customers.search({
        query: "'name:\'"+req.params.cus_name+"\' AND 'email:\'"+req.params.cus_email+"\''",
      });
      const paymentMethods = await stripe.customers.listPaymentMethods(
        customer.id,
        {type: 'card'}
      ); 
      res.send(paymentMethods)
  })
  /**********************************edit payment details */
  route.post('/edit_card/:cus_email',async(req,res)=>{
    const customer =  await stripe.customers.search({
        query: 'email:\''+req.params.cus_email+'\'',
      });
    console.log(customer)
      const paymentMethods = await stripe.customers.listPaymentMethods(
        customer.data[0].id,
        {type: 'card'}
      ); 
      const paymentMethod = await stripe.paymentMethods.update(
        paymentMethods.data[0].id,
        {card: {exp_month:req.body.month,exp_year:req.body.year}}
      );
      res.send(paymentMethod)
  })
module.exports=route