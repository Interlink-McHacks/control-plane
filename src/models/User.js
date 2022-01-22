const mongoose = require("mongoose");

const fields = {
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    tenantID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}

const schema = new mongoose.Schema(fields);