const Tunnel = require('../models/Tunnel');
const TunnelController = {};

TunnelController.createTunnel = async function (name, description, hostID, tenantID, hostConnectPort, wgListeningPort, type) {
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
    await Tunnel.deleteOne({
        _id: id
    })
}

TunnelController.getTunnelsOfTenant = function(tenantID) {
    return Tunnel.find({
        tenantID
    })
}

module.exports = TunnelController;