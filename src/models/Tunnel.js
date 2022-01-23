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
        required: true,
        index: true
    },
    tenantID: {
        type: String,
        required: true,
        index: true
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

schema.index({name: 1, tenantID: 1}, {unique: true});

module.exports = mongoose.model('Tunnel', schema);