const short = require('short-uuid');
const Host = require('../models/Host');
const SettingsController = require('../controllers/SettingsController');

const HostController = {};

HostController.createHost = async function(tenantID, name) {
    const secret = short.generate();
    const contactPoint = await SettingsController.generateOpenIP();

    const host = await Host.create({
        name, tenantID, secret, contactPoint
    });

    return {
        hostID: host.id,
        contactPoint,
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
