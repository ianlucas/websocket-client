function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "client", () => $3c21965c92bb175f$export$388e0302ca0d9a41);
function $3c21965c92bb175f$var$createEventEmitter() {
    const callbacks = {};
    return {
        on (type, handler) {
            if (!callbacks[type]) callbacks[type] = [];
            callbacks[type].push(handler);
        },
        emit (type, ...args) {
            if (callbacks[type]) callbacks[type].forEach((handler)=>{
                handler(...args);
            });
        }
    };
}
function $3c21965c92bb175f$var$room(url, roomType, roomId) {
    const emitter = $3c21965c92bb175f$var$createEventEmitter();
    const ws = new WebSocket(url + "/" + roomType + "/" + roomId);
    function handleMessage(event) {
        const data = JSON.parse(event.data);
        switch(data.type){
            case "state":
                emitter.emit("state", data.value);
                break;
            default:
                throw new Error("Invalid message type sent by server.");
        }
    }
    function handleClose(event) {
        emitter.emit("close", event.reason);
    }
    ws.addEventListener("close", handleClose);
    ws.addEventListener("message", handleMessage);
    return {
        onStateChange (callback) {
            emitter.on("state", callback);
        },
        send (type, value) {
            ws.send(JSON.stringify({
                type: type,
                value: value
            }));
        }
    };
}
function $3c21965c92bb175f$export$388e0302ca0d9a41(url) {
    return {
        room (roomType, roomId) {
            return $3c21965c92bb175f$var$room(url, roomType, roomId);
        }
    };
}


//# sourceMappingURL=websocketClient.common.js.map
