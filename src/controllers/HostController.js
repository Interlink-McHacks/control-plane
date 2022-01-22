const short = require('short-uuid');
const Host = require('../models/Host');

const HostController = {};

HostController.createHost = async function(tenantID, name, contactPoint) {
    const secret = short.generate();

    const host = await Host.create({
        name, tenantID, secret, contactPoint
    });

    return {
        hostID: host.id,
        secret
    }
}

HostController.getHostSecret = async function(hostID) {
    const host = await Host.findOne({
        _id: hostID
    }).select('secret');

    if(!host){
        throw Error("Host does not exist.")
    }

    return host.secret;
}

HostController.getHost = async function(hostID) {
    const host = await Host.findOne({
        _id: hostID
    });

    if(!host){
        throw Error("Host does not exist.")
    }

    return host;
}

HostController.getHostControl = async function(hostID) {
    return {

    }
}

HostController.deleteHost = async function(id) {
    await Host.deleteOne({
        _id: id
    })
}

module.exports = HostController;
