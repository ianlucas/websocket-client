export function connectToWebSocketServer(url: string): {
    getRoom(roomType: string, roomId: string): {
        onStateChange(callback: (state: any) => void): void;
        send(type: string, value: any): void;
    };
};

//# sourceMappingURL=types.d.ts.map
