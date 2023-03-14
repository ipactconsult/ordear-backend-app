const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const Customer = require("../Entities/Customer");
const employees = require('../Entities/User') 

  router.get("/home", homeController.getHome);
  router.post("/home/upload", uploadController.uploadFiles);
  router.get("/home/files", uploadController.getListFiles);
  router.get("/home/files/:name", uploadController.download);
  router.post("/home/set_image_profile/:id",uploadController.set_Img_Profile)
  router.post("/home/set_image_profile_customer/:id",uploadController.set_Customer_Image)


module.exports = router;