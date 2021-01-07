const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const users = require("./api/users.controller");
const messages = require("./api/messages.controller");
const stockBot = require("./api/stock-bot.controller");
const StockBotService = require('./api/stock-bot.service')
const {mongoUrl} = require('./config/config')

const app = express();

// Port that the webserver listens to
const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
    console.log(`Server running on port ${port}`)
);

const io = require("socket.io").listen(server);

// Body Parser middleware to parse request bodies
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Successfully Connected"))
    .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Assign socket object to every request
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use((err, req, res, next) => {
    res.status(500).json({error: err})
})

// Workers
function startWorkers() {
    if (process.env.JEST_WORKER_ID !== undefined) {
        console.log('Workers will not be automatically started while running unit tests')
    } else {
        StockBotService.startStockQuotesWorker(io)
            .then(() => console.log('Stock Bot Started!'))
            .catch((err) => console.error(`ERROR: Stock Bot didn't start: ${err.message}`))
    }
}
startWorkers()

// Routes
app.use("/api/users", users);
app.use("/api/messages", messages);
app.use("/api/stock-bot", stockBot);

module.exports = app