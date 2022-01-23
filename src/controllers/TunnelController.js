const nJwt = require('njwt');

const Host = require('../models/Host');
const Tunnel = require('../models/Tunnel');
const TunnelController = {};

const signingKey = process.env.JWT_KEY;

TunnelController.createTunnel = async function (name, description, hostID, tenantID, hostConnectPort, type) {
    const wgListeningPort = await Host.registerWGPort(hostID);
    const tunnel = await Tunnel.create({
        name, description, hostID, tenantID, hostConnectPort, wgListeningPort, type
    });

    return tunnel;
}

TunnelController.getTunnel = async function(id) {
    const tunnel = await Tunnel.findOne({
        _id: id
    });

    if(!tunnel){
        throw Error("Given tunnel does not exist.")
    }

    return tunnel;
}

TunnelController.deleteTunnel = async function(id) {
    const tunnel = await Tunnel.findOne({
        _id: id
    }).select(['hostID', 'wgListeningPort']);

    if(tunnel){
        await Host.unregisterWGPort(tunnel["hostID"], tunnel["wgListeningPort"]);

        await Tunnel.deleteOne({
            _id: id
        })
    }

}

TunnelController.getTunnelsOfTenant = function(tenantID) {
    return Tunnel.find({
        tenantID
    })
}

TunnelController.createConnectionToken = async function(userID, tunnelID) {
    // verify that the host is online
    const tunnel = await Tunnel.findOne({
        _id: tunnelID
    });

    if(!tunnel){
        throw Error("Tunnel does not exist.");
    }

    return nJwt.create({
        iss: "interlink::control-plane",
        sub: userID.toString(),
        tunnelID: tunnelID
    }, signingKey).setExpiration(new Date().getTime() + (60*60*1000)).compact();
}

module.exports = TunnelController;