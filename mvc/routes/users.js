const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './images');
	},
	filename: function (req, file, cb) {
		cb(null , file.originalname);
	}
});

const upload = multer({ storage: storage })
const mongoose = require("mongoose");
const User = mongoose.model("User");


router.get('/', function(req, res) {
	User.find((err, users) => {
		if(err) { return res.send(error); }
		return res.json(users);
	});
});

router.post('/register', upload.single('image'), function(req, res) {
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
