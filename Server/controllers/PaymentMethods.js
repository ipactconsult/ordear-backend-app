const path = require('path')
const process=require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const stripe = require('stripe')(process.parsed.StripeApi);

const addPaymentMethod = async(req,res)=>{
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
  
  }
  const displayPaymentMethods  = async(req,res)=>{
    const customer = await stripe.customers.search({
        query: "'name:\'"+req.params.cus_name+"\' AND 'email:\'"+req.params.cus_email+"\''",
      });
      const paymentMethods = await stripe.customers.listPaymentMethods(
        customer.id,
        {type: 'card'}
      ); 
      res.send(paymentMethods)
  }
 const EditPaymentMethods =  async(req,res)=>{
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
  }
  module.exports={
    addPaymentMethod,displayPaymentMethods,EditPaymentMethods
  }
