function $d2b38d6a7f8bb4d2$var$createEventEmitter() {
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
function $d2b38d6a7f8bb4d2$var$room(url, roomType, roomId) {
    const emitter = $d2b38d6a7f8bb4d2$var$createEventEmitter();
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
function $d2b38d6a7f8bb4d2$export$388e0302ca0d9a41(url) {
    return {
        room (roomType, roomId) {
            return $d2b38d6a7f8bb4d2$var$room(url, roomType, roomId);
        }
    };
}


export {$d2b38d6a7f8bb4d2$export$388e0302ca0d9a41 as client};
//# sourceMappingURL=websocketClient.module.js.map
