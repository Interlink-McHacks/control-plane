const mongoose = require('mongoose')
const fields = {
    assignedIPs: {
        type: [Number],
        required: true,
        default: []
    }
}

const schema = new mongoose.Schema(fields);

module.exports = mongoose.model('Setting', schema);