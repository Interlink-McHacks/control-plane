const short = require('short-uuid');
const Host = require('../models/Host');

const HostController = {};

HostController.createHost = async function(tenantID, name) {
    const secret = short.generate();

    const host = await Host.create({
        name: name,
        tenantID: tenantID,
        secret: secret
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

module.exports = HostController;
