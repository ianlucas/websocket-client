export function client(url: string): {
    room(roomType: string, roomId: string): {
        onStateChange(callback: (state: any) => void): void;
        send(type: string, value: any): void;
    };
};

//# sourceMappingURL=types.d.ts.map
