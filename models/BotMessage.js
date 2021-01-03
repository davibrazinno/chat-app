const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const BotMessageSchema = new Schema({
    fromConversation: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    from: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date.now,
    },
});

module.exports = BotMessage = mongoose.model('bot_messages', BotMessageSchema);
