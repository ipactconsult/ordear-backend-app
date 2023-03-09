const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
let dbConfig={
url: "mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net/",
  database: "Ordear_DB",
  imgBucket: "photos",
}
var storage = new GridFsStorage({
  url: "mongodb+srv://Ipactconsult:Ipact2021@cluster0.jt1kl.mongodb.net/Ordear_DB",
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-bezkoder-${file.originalname}`;
     
      return filename
    }
    return {
      bucketName: dbConfig.imgBucket,
      filename: `${Date.now()}-bezkoder-${file.originalname}`,
    // executor_id:req.body.exec
    };
  }
});
var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;