const mongoose = require('mongoose');
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
        required: true,
        index: true
    },
    tenantID: {
        type: String,
        required: true,
        index: true
    },
    contactPoint: {
        type: String,
        required: true,
        index: true
    },
    assignedWGPorts: {
        type: [Number],
        required: true,
        default: []
    }
}

const schema = new mongoose.Schema(fields);

schema.statics.registerWGPort = async function(hostID) {
    const host = await this.findOne({
        _id: hostID
    }).select('assignedWGPorts');

    if(!host){
        new Error("Host does not exist.");
    }

    while (true) {
        const num = 1024 + Math.floor(Math.random() * 64512);

        if(!host["assignedWGPorts"].includes(num)){
            await this.updateOne({
                _id: hostID
            }, {
                $push: {
                    assignedWGPorts: num
                }
            });
            return num;
        }
    }
}

schema.statics.unregisterWGPort = function(hostID, port) {
    return this.updateOne({
        _id: hostID
    }, {
        $pull: {
            assignedWGPorts: port
        }
    })
}

module.exports = mongoose.model('Host', schema)