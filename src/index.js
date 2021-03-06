require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");
const SettingsController = require('./controllers/SettingsController');

const ExpressRouting = require("./services/ExpressRouting");
const WebSocketServer = require("./services/WebSocketServer");

mongoose.connect(process.env.MONGO_URL).then((result) => {
    SettingsController.ensure().then(() => {
        const HTTPServer = http.createServer(ExpressRouting);
        const port = process.env.PORT || '3000';

        HTTPServer.listen(port, '0.0.0.0');
        HTTPServer.on('listening', function() {
            console.log(`Listening on port ${port}`);
        });

        HTTPServer.on('upgrade', WebSocketServer);
    })
}).catch((err) => {
    console.error("Unable to establish a connection to the database!", err);
    process.exit(1);
})