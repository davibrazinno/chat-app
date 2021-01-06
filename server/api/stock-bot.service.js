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
        if (!stock || stock === '') {
            return reject('Error: stock parameter is required')
        }
        https.get(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`, (resp) => {
            const notFoundMessage = `${stock.toUpperCase()} quote not found`
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                csv.parseString(data, {headers: true, discardUnmappedColumns: true})
                    .on('error', error => {
                        console.error(`Error parsing stock '${stock}' data: ${data}`, error)
                        return resolve(notFoundMessage)
                    })
                    .on('data', row => {
                        if (row.Close === 'N/D') {
                            return resolve(notFoundMessage)
                        } else {
                            const message = `${row.Symbol} quote is $${row.Close} per share`
                            return resolve(message)
                        }
                    });

            });

        }).on("error", (err) => {
            return reject("Error: " + err.message);
        });
    })
}

module.exports = {
    getStockBotMessages,
    startStockQuotesWorker,
    getStockQuote
};