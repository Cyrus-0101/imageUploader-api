const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const azureBlob = require('../../utils/azureBlob');

//changed from multer.diskstorage to multer.memory storage
const storage = multer.memoryStorage()

//MulterFilter will filter the request coming through on images specified
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
        console.log('it failed');
        //loging an error to the console if the conditions abobe are not met
      cb(null, false);
    }
};

//Add fileFilter option to filter and passing multerFilter to it that is defined above
const upload = multer({ storage: storage, fileFilter: multerFilter});
const mongoose = require("mongoose");
const User = mongoose.model("User");


router.get('/', function(req, res) {
	User.find((err, users) => {
		if(err) { return res.send(error); }
		return res.json(users);
	});
});

//Sharp image resizing controller/middleware
const resizeImages = async (req, res, next) =>{
    console.log('file touched');
    //this skips this middleware immediately there is no files
    if (!req.file) return next();
    
    console.log();
    // Check if there is a file with name image
    if (req.file.fieldname === 'image') {
        const imageFilename = `image-${Date.now()}-.jpeg`;
        const buffer = await sharp(req.file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 70 })

          .toBuffer();
        //   .toFile(`public/images/${imageFilename}`);
        await azureBlob.uploadImage(buffer, imageFilename, 'test');
        req.body.image = imageFilename;
      }
 next()
}

//You have used upload.single and this mean the route can only accept a single image 
//another option would have been to use upload.fields([])
router.post('/register', upload.single('image'), resizeImages,  function(req, res) {
	let newUser = {
		name: req.body.name,
		image: req.file.originalname
	}
	
	User.create(newUser, (err, user) => {
		if(err) { return res.send(error); }
		return res.send(user);
	});
});

router.delete('/reset', function(req, res) {
	User.deleteMany((err, info) => {
		if(err) { return res.send({ error: err }) }
		return res.send(info);
	});
});

module.exports = router;
