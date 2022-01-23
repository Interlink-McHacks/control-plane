const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const app = express();

const apiRouter = require('../routes/api');
const proxyRouter = require('../routes/proxy');

app.use(morgan('combined'));

app.use(cors());

app.use(express.json())

app.use('*', proxyRouter);

app.use('/api',apiRouter);

module.exports = app;