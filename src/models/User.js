const mongoose = require("mongoose");

const fields = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    }
}

const schema = new mongoose.Schema(fields);

module.exports = mongoose.model('User', schema);