const WebSocket = require('faye-websocket')

module.exports = {
    handleUpgrade(request, socket, head, reqURL) {
        const queryObject = reqURL.searchParams;
        const relayDestinationName = queryObject.get('destination');
        const token = queryObject.get('token');

        // TODO: verify the token is allowed to access the relay destination

        // TODO: get the websocket endpoint

        if (WebSocket.isWebSocket(request)) {
            const wss = new WebSocket(request, socket, head);
            const ws = new WebSocket.Client('ws://host2.interlink.rest:8080');

            wss.pipe(ws).pipe(wss);
        }
    }
}