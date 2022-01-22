const mongoose = require('mongoose');
const fields = {
    name: {
        type: String,
        required: true
    },
    joinToken: {
        type: String,
        required: true
    }
}

const schema = new mongoose.Schema(fields);

module.exports = mongoose.model('Tenant', schema)