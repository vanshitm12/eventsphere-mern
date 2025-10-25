const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/signup', register);  // added this for better clarity
router.post('/login', login); // routes

module.exports = router;
