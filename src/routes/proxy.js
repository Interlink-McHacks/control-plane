const proxy = require('express-http-proxy');

const TunnelController = require('../controllers/TunnelController');
const HostController = require('../controllers/HostController');
const TenantController = require('../controllers/TenantController');

const connectionCache = {};

module.exports = (req, res, next) => {
    if(req.hostname.endsWith(process.env.REVERSE_DOMAIN)){
        const tunnelInfo = req.hostname.replace(process.env.REVERSE_DOMAIN, "");
        const [tunnelName, tenantName] = req.hostname.split(".");

        if(!connectionCache[tunnelInfo]){
            TenantController.getTenantIDByName(tenantName).then((tenantID) => {
                TunnelController.getTunnelByName(tunnelName, tenantID).then((tunnel) => {
                    HostController.getHost(tunnel.hostID).then((host) => {
                        connectionCache[tunnelInfo] = {
                            contactPoint: host['contactPoint'],
                            port: tunnel['wgListeningPort'],
                            type: tunnel['type']
                        }
                        connectionCache[tunnelInfo]['middleware'] = proxy(`http://${connectionCache[tunnelInfo]['contactPoint']}:${connectionCache[tunnelInfo]['port']}`)

                        if(host.online && connectionCache[tunnelInfo].type === "HTTP"){
                            return connectionCache[tunnelInfo].middleware(req, res, next);
                        }
                        else {
                            console.log("Attempted to connect to tunnel with no online host or incompatible type.")
                            return res.status(503).json({
                                status: 503,
                                error: "Attempted to connect to tunnel with no online host or incompatible type."
                            })
                        }
                    }).catch((err) => {
                        console.error("cannot fetch host info", err);
                        return res.status(500).json({
                            status: 500,
                            error: "Unable to fetch information about the tunnel host."
                        })
                    })
                }).catch((err) => {
                    console.error("cannot fetch tunnel info", err);
                    return res.status(500).json({
                        status: 500,
                        error: "Unable to fetch information about the tunnel."
                    })
                })
            }).catch((err) => {
                console.error("cannot lookup tenant", err);
                return res.status(500).json({
                    status: 500,
                    error: "Unable to fetch information about the tunnel."
                })
            })

        }
        else {
            if(connectionCache[tunnelInfo].type === "HTTP"){
                return connectionCache[tunnelInfo].middleware(req, res, next);
            }
            else {
                return res.status(503).json({
                    status: 503,
                    error: "Attempted to connect to tunnel with no online host or incompatible type."
                })
            }
        }
    }
    else {
        return next();
    }
}