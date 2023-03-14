const upload = require("../middleware/upload");
const users=require('../Entities/User')

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = "mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net/Ordear_DB";

const baseUrl = "http://localhost:8000/images/home/files/";

const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    console.log(req.file);

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    return res.send({
      message: "File has been uploaded.",
      file:req.file
    });
  } catch (error) {
    console.log(error);

    return res.send({
      
      message: "Error when trying upload image: ${error}",
    });
  }
};
const set_Img_Profile = async (req,res) => {
  await  users.updateOne(
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
};
const getListFiles = async (req, res) => {
  try {
    await mongoClient.connect("mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net/Ordear_DB");
    let dbConfig={
      url: "mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net",
        database: "Ordear_DB",
        imgBucket: "photos",
      }
    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).send(fileInfos);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect("mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net/Ordear_DB");
    let dbConfig={
      url: "mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net",
        database: "Ordear_DB",
        imgBucket: "photos",
      }
    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).send({ message: "Cannot download the Image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const set_Customer_Image = async(req,res)=>{
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
};

module.exports = {
  uploadFiles,
  getListFiles,
  download,
  set_Img_Profile,
  set_Customer_Image
}