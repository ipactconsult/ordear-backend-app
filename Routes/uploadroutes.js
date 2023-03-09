const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const Customer = require("../Entities/Customer");
const employees = require('../Entities/Employee') 

  router.get("/home", homeController.getHome);

  router.post("/home/upload", uploadController.uploadFiles);
  router.get("/home/files", uploadController.getListFiles);
  router.get("/home/files/:name", uploadController.download);
  router.post("/home/set_image_profile/:id",async(req,res)=>{
    await  employees.updateOne(
      { "_id": req.params.id}, // Filter
      {$set:{"image":req.body.image}} // Update
  )
  .then((obj) => {
      console.log('Updated - ' + obj);
      res.send(obj)
  })
  .catch((err) => {
      console.log('Error: ' + err);
  })
  })
  router.post("/home/set_image_profile_customer/:id",async(req,res)=>{
    await  Customer.updateOne(
      { "_id": req.params.id}, // Filter
      {$set:{"image":req.body.image}} // Update
  )
  .then((obj) => {
      console.log('Updated - ' + obj);
      res.send(obj)
  })
  .catch((err) => {
      console.log('Error: ' + err);
  })
  })


module.exports = router;