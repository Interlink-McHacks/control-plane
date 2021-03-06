const mongoose = require('mongoose');
const fields = {
    tenantID: {
        type: String,
        required: true,
        index: true
    },
    userID: {
        type: String,
        required: true,
        index: true
    }
}

const schema = new mongoose.Schema(fields);

schema.index({
    tenantID: 1,
    userID: 1
}, {unique: true})

module.exports = mongoose.model('TenantACL', schema);