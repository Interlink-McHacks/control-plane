const expressRouting = require("express");
const cors = require("cors");
const app = expressRouting();

app.use(cors());

module.exports = app;