const nJwt = require('njwt');
const WebSocket = require('faye-websocket');
const TunnelController = require('../../controllers/TunnelController');
const HostController = require('../../controllers/HostController');

module.exports = {
    handleUpgrade(request, socket, head, reqURL) {
        const queryObject = reqURL.searchParams;
        const token = queryObject.get('token');

        nJwt.verify(token, process.env.JWT_KEY, function(err, verifiedJwt) {
            if(err){
                return socket.destroy();
            }

            if (WebSocket.isWebSocket(request)) {
                TunnelController.getTunnel(verifiedJwt.body.tunnelID).then((tunnel) => {
                    HostController.getHost(tunnel.hostID).then((host) => {
                        if(host.online){
                            const wss = new WebSocket(request, socket, head);
                            const ws = new WebSocket.Client(`ws://${host['contactPoint']}:${tunnel['wgListeningPort']}`);

                            wss.pipe(ws).pipe(wss);
                        }
                        else {
                            console.log("Attempted to connect to tunnel with no online host.")
                            return socket.destroy();
                        }
                    }).catch((err) => {
                        console.error("cannot fetch host info", err);
                        return socket.destroy();
                    })
                }).catch((err) => {
                    console.error("cannot fetch tunnel info", err);
                    return socket.destroy();
                })
            }
        });
    }
}