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
}

const schema = new mongoose.Schema(fields);