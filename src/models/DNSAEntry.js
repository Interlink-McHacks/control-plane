const mongoose = require('mongoose');
const fields = {
    tenantID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    destination: {
        type: String,
        required: true
    }
}

const schema = new mongoose.Schema(fields);

module.exports = mongoose.model('DNSAEntry', schema);