// Set express and route
const express = require('express');
const router = express.Router();

const userCtrl = require('../controller/user.controller.js');
const authMiddleware = require('../middleware/auth.js');

router.get('/list', authMiddleware, userCtrl.list);

router.post('/login', userCtrl.login);
router.post('/register', authMiddleware, userCtrl.register);
router.post('/logout', authMiddleware, userCtrl.logout);

router.get('/me', authMiddleware, userCtrl.me);
router.get('/destList', authMiddleware, userCtrl.destList);
router.patch('/update', authMiddleware, userCtrl.update);
router.delete('/delete', authMiddleware, userCtrl.delete);
router.delete('/remove', authMiddleware, userCtrl.remove);

module.exports = router;
