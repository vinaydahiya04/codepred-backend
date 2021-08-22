const express = require('express')
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword } = require('./../controllers/authControllers')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);


module.exports = router;


