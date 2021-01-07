const {rabbitUrl} = require('../config/config')
const ampq = require('amqplib')

async function connect() {
    return ampq.connect(rabbitUrl)
}

async function createQueue(channel, queue) {
    await channel.assertQueue(queue, {durable: true});
    return channel
}

async function sendToQueue(queueName, message) {
    const conn = await connect()
    const channel = await conn.createChannel()
    await createQueue(channel, queueName)
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
}

async function consume(queueName, callback) {
    const conn = await connect()
    const channel = await conn.createChannel()
    await createQueue(channel, queueName)
    await channel.consume(queueName, callback, {noAck: true})
}

module.exports = {
    sendToQueue,
    consume,
    connect
}