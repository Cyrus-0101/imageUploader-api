const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { v4 } = require('uuid');

const User = mongoose.model("User");
const azureBlob = require('../utils/azureBlob');

const storage = multer.memoryStorage()

//Add fileFilter option to filter and passing multerFilter to it that is defined above
const upload = multer({ storage: storage });

//Sharp image resizing controller/middleware
const resizeImages = async (req, res, next) => {
  //this skips this middleware immediately there is no files
  if (!req.file) return next();
  
  // Check if there is a file with name image
  const imageFilename = `bonga-messenger-image-${Date.now()}-${v4()}.jpeg`;
  const buffer = await sharp(req.file.buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 70 })
    .toBuffer();

  await azureBlob.uploadImage(buffer, imageFilename, `${process.env.AZURE_PROFILE_PHOTO_CONTAINER_NAME}`);

  req.file.fieldname = `${process.env.AZURE_BLOB_STORAGE_DUMP_URL}${imageFilename}`;
  next();
};

//You have used upload.single and this mean the route can only accept a single image 
//another option would have been to use upload.fields([])
router.post('/upload', upload.single('image'), resizeImages,  function(req, res) {

  let image = req.file.fieldname

  return res.send(image);
	
});


module.exports = router;
