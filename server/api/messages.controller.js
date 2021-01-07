const express = require('express');
const router = express.Router();
const {jwtValidation} = require('../utilities/jwt-utils')
const MessagesService = require('./messages.service');
const passport = require("passport");

const secureEndpoint = () => passport.authenticate('jwt', {session: false})

// Token verification middleware
router.use(jwtValidation);

// Get global messages
router.get('/global', secureEndpoint(), async (req, res, next) => {
    try {
        const messages = await MessagesService.getGlobalMessages();
        res.send(messages);
    } catch (err) {
        next(err)
    }
});

// Post global message
router.post('/global', secureEndpoint(), async (req, res, next) => {
    const message = req.body.body
    try {
        const globalMessage = await MessagesService.saveGlobalMessage(message, req.userId)

        req.io.sockets.emit('messages', globalMessage.body);

        res.status(201).json({message: 'Success'});
    } catch (err) {
        next(err)
    }
});

// Get conversations list
router.get('/conversations', secureEndpoint(), async (req, res, next) => {
    try {
        const conversations = await MessagesService.getConversations(req.userId)
        res.send(conversations);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// Get messages from conversation
// based on to & from
router.get('/conversations/query', secureEndpoint(), async (req, res, next) => {
    try {
        const messages = await MessagesService.getConversationsQuery(req.userId, req.query.userId)
        res.send(messages);
    } catch (err) {
        next(err)
    }
});

// Post private message
router.post('/', secureEndpoint(), async (req, res, next) => {
    try {
        const response = await MessagesService.addConversation(req.userId, req.body.to, req.body.body)
        req.io.sockets.emit('messages', req.body.body);
        res.send(response)
    } catch (err) {
        next(err)
    }
});

module.exports = router;
