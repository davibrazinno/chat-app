const mongoose = require('mongoose');

const GlobalMessage = require('../models/GlobalMessage');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const MAX_RESULTS = 50

const getGlobalMessages = () => {
    return new Promise((resolve, reject) => {
        GlobalMessage.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
        ])
            .sort({'date': -1})
            .limit(MAX_RESULTS)
            .project({
                'fromObj.password': 0,
                'fromObj.__v': 0,
                'fromObj.date': 0,
            })
            .exec((err, messages) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(messages);
                }
            });
    })
}

const saveGlobalMessage = (message, fromUserId) => {
    return new Promise((resolve, reject) => {
        const globalMessage = new GlobalMessage({
            from: fromUserId,
            body: message
        });
        globalMessage.save((err, msg) => {
            if (err) {
                reject(err);
            } else {
               resolve(msg)
            }
        });
    })
}

const getConversations = (fromUserId) => {
    return new Promise((resolve, reject) => {
        let from = mongoose.Types.ObjectId(fromUserId);
        Conversation.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'recipients',
                    foreignField: '_id',
                    as: 'recipientObj',
                },
            },
        ])
            .sort({'date': -1})
            .limit(MAX_RESULTS)
            .match({ recipients: { $all: [{ $elemMatch: { $eq: from } }] } })
            .project({
                'recipientObj.password': 0,
                'recipientObj.__v': 0,
                'recipientObj.date': 0,
            })
            .exec((err, conversations) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(conversations);
                }
            });
    })
}

const getConversationsQuery = (userId, anotherUserId) => {
    return new Promise((resolve, reject) => {
        let user1 = mongoose.Types.ObjectId(userId);
        let user2 = mongoose.Types.ObjectId(anotherUserId);
        Message.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'toObj',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'from',
                    foreignField: '_id',
                    as: 'fromObj',
                },
            },
        ])
            .sort({'date': -1})
            .limit(MAX_RESULTS)
            .match({
                $or: [
                    { $and: [{ to: user1 }, { from: user2 }] },
                    { $and: [{ to: user2 }, { from: user1 }] },
                ],
            })
            .project({
                'toObj.password': 0,
                'toObj.__v': 0,
                'toObj.date': 0,
                'fromObj.password': 0,
                'fromObj.__v': 0,
                'fromObj.date': 0,
            })
            .exec((err, messages) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(messages);
                }
            });
    })
}

const addConversation = (fromUser, toUser, msg) => {
    return new Promise((resolve, reject) => {
        let from = mongoose.Types.ObjectId(fromUser);
        let to = mongoose.Types.ObjectId(toUser);

        Conversation.findOneAndUpdate(
            {
                recipients: {
                    $all: [
                        { $elemMatch: { $eq: from } },
                        { $elemMatch: { $eq: to } },
                    ],
                },
            },
            {
                recipients: [from, to],
                lastMessage: msg,
                date: Date.now(),
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
            function(err, conversation) {
                if (err) {
                    reject(err)
                } else {
                    let message = new Message({
                        conversation: conversation._id,
                        to: to,
                        from: from,
                        body: msg,
                    });

                    message.save(err => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve({
                                message: 'Success',
                                conversationId: conversation._id,
                            })
                        }
                    });
                }
            }
        );
    })
}

module.exports = {
    getGlobalMessages,
    saveGlobalMessage,
    getConversations,
    getConversationsQuery,
    addConversation
}