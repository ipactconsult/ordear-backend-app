const Vonage = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "4aec4d48",
  apiSecret: "er9TtThe6yMD07iX"
})

const express= require('express')
const route=express.Router();
route.get('/send_sms/:to/:text',(req,res)=>{
  const random = Math.floor(Math.random() * 9000 + 1000);

  console.log(random);
    const from = "Vonage APIs"
    const to = req.params.to
    const text = random + req.body.email+req.body.password
    
    async function sendSMS() {
        await vonage.sms.send({to, from, text})
            .then(resp => { console.log('Message sent successfully'); console.log(resp); })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
    }
    
    res.send(sendSMS());    
})
module.exports=route
