const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

const keys = require('../../config/keys');
const verify = require('../../utilities/verify-token');
const BotMessage = require('../../models/BotMessage');
const {sendToQueue} = require('../../utilities/rabbitmq')

let jwtUser = null;

// Token verification middleware
router.use(function(req, res, next) {
    try {
        jwtUser = jwt.verify(verify(req), keys.secretOrKey);
        next();
    } catch (err) {
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        res.sendStatus(401);
    }
});

// Post stock-bot message
router.post('/', async (req, res) => {
    const queue = 'STOCK_QUOTES';
    const msg = {
        ...req.body,
        to: jwtUser.id
    }
    sendToQueue(queue, msg)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Success' }));
});

// Get stock-bot messages
router.get('/', (req, res) => {
    let user = mongoose.Types.ObjectId(jwtUser.id);
    BotMessage.find({to: user})
        .lean()
        .sort({'date': -1})
        .exec((err, botMessages) => {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Failure' }));
                res.sendStatus(500);
            } else {
                res.send(botMessages.map((botMessage) => {
                    const msg = {
                        ...botMessage,
                        _id: botMessage.date,
                        fromObj: [{_id: 'BOT', name: 'Stock Bot', username: 'stock-bot'}]
                    }
                    if (botMessage.fromConversation) {
                        msg.toObj = [{_id: msg.to}]
                    }
                    return msg;
                }));
            }
        });
});

module.exports = router;