const exp=require('express')
const route=exp.Router()
const restaurant=require('../Entities/Restaurant')
const QRCode=require('qrcode')
const employees=require('../Entities/Employee')

route.post('/add_restaurant',async(req,res)=>{
    let Qrcode=""
    QRCode.toString(req.body.restaurant_name+req.body.restaurant_address+req.body.phone,{type:'base64'}, function (err, url) {
        QrCode=url.toString()
        console.log(url.toString())
      })
      let data=req.body.restaurant_name+req.body.restaurant_address+req.body.phone
    await restaurant.create({
        restaurant_name:req.body.restaurant_name,
        restaurant_address:req.body.restaurant_address,
        phone:req.body.phone,
        
    },(err,docs)=>{
        if(err) {
            console.log(err)
            res.send(err) }
            else res.send(docs)
    })    
})


route.get('/get_employees/:id',async(req,res)=>{
    await employees.find({ "restaurant": req.params.id}
    ,(req,res)=>{
        if(err) res.send(err)
        else res.send(docs)
    })
})


module.exports=route