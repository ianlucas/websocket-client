function createEventEmitter() {
  const callbacks = {};
  return {
    on(type: string, handler: Function) {
      if (!callbacks[type]) {
        callbacks[type] = [];
      }
      callbacks[type].push(handler);
    },

    emit(type: string, ...args: any[]) {
      if (callbacks[type]) {
        callbacks[type].forEach((handler: Function) => {
          handler(...args);
        });
      }
    }
  };
}

function createRoom(url: string, roomType: string, roomId: string) {
  const emitter = createEventEmitter();
  const ws = new WebSocket(url + '/' + roomType + '/' + roomId);

  function handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'state':
        emitter.emit('state', data.value);
        break;
      default:
        throw new Error('Invalid message type sent by server.');
    }
  }

  function handleClose(event: CloseEvent) {
    emitter.emit('close', event.reason);
  }

  ws.addEventListener('close', handleClose);
  ws.addEventListener('message', handleMessage);

  return {
    onStateChange(callback: (state: any) => void) {
      emitter.on('state', callback);
    },

    send(type: string, value: any) {
      ws.send(
        JSON.stringify({
          type,
          value
        })
      );
    }
  };
}

export function connectToWebSocketServer(url: string) {
  return {
    getRoom(roomType: string, roomId: string) {
      return createRoom(url, roomType, roomId);
    }
  };
}
