// Set express and route
const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({
	// limits: {
	// 	fileSize: 1000000, // byte
	// },
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) return cb(new Error('Uploaded file must be an image!'));

		cb(undefined, true);
	},
});

const destinationControl = require('../controller/destination.controller.js');
const authMiddleware = require('../middleware/auth');

router.get('/list', destinationControl.list);
router.get('/detailList', destinationControl.detailList);
router.get('/retrieve/:dest', destinationControl.retrieve);

router.post('/avatar/:dest', authMiddleware, upload.single('avatar'), destinationControl.addAvatar);

router.post('/add', authMiddleware, destinationControl.add);
router.patch('/update/:dest', authMiddleware, destinationControl.update);
router.delete('/delete', authMiddleware, destinationControl.delete);

module.exports = router;
