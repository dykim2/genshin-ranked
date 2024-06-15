import { createContext } from "react";

export const PlayingContext = createContext();
export let socket = new WebSocket("ws://localhost:3000");
// let socket = new WebSocket("ws://localhost:3000"); - local
// let socket = new WebSocket(`wss://rankedwebsocketapi.fly.dev/`); - external
export function restartSocket(){
    if(socket.readyState == 3){
        socket = new WebSocket(`wss://rankedwebsocketapi.fly.dev/`);
    }
}
