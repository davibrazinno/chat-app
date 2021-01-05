const express = require('express');
const router = express.Router();
const {jwtValidation} = require('../utilities/jwt-utils')
const {
    getGlobalMessages,
    saveGlobalMessage,
    getConversations,
    getConversationsQuery,
    addConversation
} = require('./messages.service')


// Token verification middleware
router.use(jwtValidation);

// Get global messages
router.get('/global', async (req, res, next) => {
    try {
        const messages = await getGlobalMessages();
        res.send(messages);
    } catch (err) {
        next(err)
    }
});

// Post global message
router.post('/global', async (req, res, next) => {
    const message = req.body.body
    try {
        const globalMessage = await saveGlobalMessage(message, req.userId)

        req.io.sockets.emit('messages', globalMessage.body);

        res.status(201).json({ message: 'Success' });
    } catch (err) {
        next(err)
    }
});

// Get conversations list
router.get('/conversations', async (req, res, next) => {
    try {
        const conversations = await getConversations(req.userId)
        res.send(conversations);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// Get messages from conversation
// based on to & from
router.get('/conversations/query', async (req, res, next) => {
    try {
        const messages = await getConversationsQuery(req.userId, req.query.userId)
        res.send(messages);
    } catch (err) {
        next(err)
    }
});

// Post private message
router.post('/', async (req, res, next) => {
    try {
        const response = await addConversation(req.userId, req.body.to, req.body.body)
        req.io.sockets.emit('messages', req.body.body);
        res.send(response)
    } catch (err) {
        next(err)
    }
});

module.exports = router;
