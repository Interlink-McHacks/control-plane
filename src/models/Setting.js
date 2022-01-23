const mongoose = require('mongoose')
const fields = {
    assignedIPs: {
        type: [String],
        required: true,
        default: []
    }
}

const schema = new mongoose.Schema(fields);

module.exports = mongoose.model('Setting', schema);