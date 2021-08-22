const express = require('express')
const router = express.Router()
const { sendPredictions, sendData } = require('./../controllers/predControllers')

router.get('/info', sendPredictions);
router.get('/data', sendData);

module.exports = router;


