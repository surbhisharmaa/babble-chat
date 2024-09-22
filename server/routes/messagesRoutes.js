const { model } = require('mongoose');
const { addMessage, getAllMessage } = require('../controllers/messagesController');


const router = require('express').Router()

router.post('/add-message', addMessage);
router.post('/get-message', getAllMessage);

module.exports = router;