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
        required: true
    },
    tenantID: {
        type: String,
        required: true
    }
}