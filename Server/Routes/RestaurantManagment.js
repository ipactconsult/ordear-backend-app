const exp=require('express')
const route=exp.Router()
const restaurant=require('../Entities/Restaurant')
const QRCode=require('qrcode')
const employees=require('../Entities/User')

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
        QrCode:data,
        Franchise:req.body.Franchise
    },(err,docs)=>{
        if(err) res.send(err)
        else res.send(docs)
    })    
})
route.put('/edit_restaurant/:id',async(req,res)=>{
    await restaurant.updateOne({ "_id": req.params.id}, // Filter
    {$set:{"phone":req.body.phone,"restaurant_address":req.body.restaurant_address,"restaurant_name":req.body.restaurant_name}} // Update
    ,(err,docs)=>{
        if(err) res.send(err)
        else res.send(docs)
    })
})
route.get('/retrieve_restaurant/:id',async(req,res)=>{
    await restaurant.find({ "_id": req.params.id}
    ,(err,docs)=>{
        if(err) res.send(err)
        else res.send(docs)
    })
})
route.get('/retrieve_restaurants',async(req,res)=>{
     restaurant.find({}
    ,(err,docs)=>{
        if(err) res.send(err)
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
route.post('/generate_restaurant_qr_code/:id',async(req,res)=>{
    restaurant.find({_id:req.params.id},(err,docs)=>{
        if(err) res.send(err)
        else{
        QRCode.toString(docs[0].restaurant_name+docs[0].restaurant_address+docs[0].phone+docs[0].owner,{type:'base64'}, function (err, url) {
            QrCode=url.toString()
            console.log(url.toString())
            res.send(QrCode)
          })}
    })
})

module.exports=route