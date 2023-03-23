const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

router.put('/signup', authController.signup);

module.exports = router;
