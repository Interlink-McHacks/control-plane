const short = require('short-uuid');
const Host = require('../models/Host');
const Tunnel = require('../models/Tunnel');
const SettingsController = require('../controllers/SettingsController');

const HostController = {};

HostController.createHost = async function(tenantID, name, contactPoint) {
    const secret = short.generate();
    if(!contactPoint){
        contactPoint = await SettingsController.generateOpenIP();
    }

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

HostController.updateHeartbeat = async function(hostID) {
    await Host.updateOne({
        _id: hostID
    }, {
        lastHeartbeat: Date.now()
    })
}

HostController.deleteHost = async function(id) {
    const host = await Host.findOne({
        _id: id
    }).select('contactPoint');

    if(host) {
        await SettingsController.unregisterIP(host["contactPoint"]);
        await Host.deleteOne({
            _id: id
        })
    }

}

HostController.getHostsOfTenant = function(tenantID) {
    return Host.find({
        tenantID: tenantID
    })
}


module.exports = HostController;
