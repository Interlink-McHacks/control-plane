const mongoose = require('mongoose');
const fields = {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    hostID: {
        type: String,
        required: true
    },
    tenantID: {
        type: String,
        required: true
    },
    hostConnectPort: {
        type: Number,
        required: true
    },
    wgListeningPort: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["TCP", "HTTP"],
        required: true,
        default: "TCP"
    }
}

const schema = new mongoose.Schema(fields);

module.exports = mongoose.model('Tunnel', schema);