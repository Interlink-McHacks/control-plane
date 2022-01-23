const short = require('short-uuid');
const Host = require('../models/Host');
const Tunnel = require('../models/Tunnel');
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
    const tunnels = await Tunnel.find({
        hostID: hostID
    })

    return {
        tunnels: tunnels
    }
}

HostController.deleteHost = async function(id) {
    await Host.deleteOne({
        _id: id
    })
}

HostController.getHostsOfTenant = function(tenantID) {
    return Host.find({
        tenantID: tenantID
    })
}

module.exports = HostController;
