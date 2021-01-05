const mongoose = require('mongoose');
const https = require('https');
const csv = require('@fast-csv/parse');
const {consume} = require('../utilities/rabbitmq');
const BotMessage = require('../models/BotMessage');

const getStockBotMessages = async (userId) => {
    return new Promise((resolve, reject) => {
        let user = mongoose.Types.ObjectId(userId);
        return BotMessage.find({to: user})
            .lean()
            .sort({'date': -1})
            .exec((err, botMessages) => {
                if (err) {
                    reject(err);
                } else {
                    const messages = botMessages.map((botMessage) => {
                        const msg = {
                            ...botMessage,
                            _id: botMessage.date,
                            fromObj: [{_id: 'BOT', name: 'Stock Bot', username: 'stock-bot'}]
                        }
                        if (botMessage.fromConversation) {
                            msg.toObj = [{_id: msg.to}]
                        }
                        return msg;
                    })
                    resolve(messages)
                }
            });
    })
};

const startStockQuotesWorker = socket => {
    const queue = 'STOCK_QUOTES'
    consume(queue, async message => {
        const msg = JSON.parse(message.content.toString())
        const quote = await getStockQuote(msg.stock)

        const botMessage = new BotMessage({
            ...msg,
            date: new Date().getTime(),
            body: quote,
            from: 'Stock Bot',
            to: msg.to
        })
        if (!(msg.scope instanceof String)) {
            botMessage.fromConversation = msg.scope._id
        }

        botMessage.save((err) => {
            if (err) {
                console.error(err)
            } else {
                socket.emit(`bot-message-${msg.to}`, botMessage)
            }
        })
    })
    console.log("worker started");
}

const getStockQuote = async stock => {
    return new Promise((resolve, reject) => {
        https.get(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                csv.parseString(data, { headers: true })
                    .on('error', error => reject(error))
                    .on('data', row => {
                        if (row.Close === 'N/D') {
                            resolve(`${stock.toUpperCase()} quote not found`)
                        } else {
                            const message = `${row.Symbol} quote is $${row.Close} per share`
                            resolve(message)
                        }
                    });
            });

        }).on("error", (err) => {
            reject("Error: " + err.message);
        });
    })
}

module.exports = {
    getStockBotMessages,
    startStockQuotesWorker,
    getStockQuote
};