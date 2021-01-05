const express = require('express');
const router = express.Router();
const {jwtValidation} = require('../utilities/jwt-utils')
const {getStockBotMessages} = require('./stock-bot.service')
const rabbitmq = require('../utilities/rabbitmq')

// Token verification middleware
router.use(jwtValidation);

// Post stock-bot message
router.post('/', async (req, res, next) => {
    const queue = 'STOCK_QUOTES';
    const msg = {
        ...req.body,
        to: req.userId
    }
    try {
        rabbitmq.sendToQueue(queue, msg)
        res.status(200).json({ message: 'Success' })
    } catch (err) {
        next(err);
    }
});

// Get stock-bot messages
router.get('/', async (req, res, next) => {
    try {
        const botMessages = await getStockBotMessages(req.userId)
        res.status(200).json(botMessages)
    } catch (err) {
        next(err)
    }
});

module.exports = router;