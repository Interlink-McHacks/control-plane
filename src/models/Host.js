const mongoose = require('mongoose');
const fields = {
    name: {
        type: String,
        required: true
    },
    lastHeartbeat: {
        type: Number,
        required: true,
        default: 0
    },
    secret: {
        type: String,
        required: true,
        index: true
    },
    tenantID: {
        type: String,
        required: true,
        index: true
    }
}

const schema = new mongoose.Schema(fields);
module.exports = mongoose.model('Host', schema)