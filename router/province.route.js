// Set express and route
const express = require('express');
const router = express.Router();

const provinceControl = require('../controller/province.controller.js');
const authMiddleware = require('../middleware/auth.js');

router.get('/', provinceControl.province);
router.get('/:prov', provinceControl.retrieve);
router.get('/list/:prov', provinceControl.list);

router.post('/add', authMiddleware, provinceControl.add);

router.patch('/update', authMiddleware, provinceControl.update);

module.exports = router;
