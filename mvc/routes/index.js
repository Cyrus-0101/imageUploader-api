const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res) {
	return res.json("Nothing to see here...");
});

router.get('/images/:img', function(req, res) {
	return res.sendFile(path.resolve(__dirname, `../../images/${req.params.img}`));
});

module.exports = router;
