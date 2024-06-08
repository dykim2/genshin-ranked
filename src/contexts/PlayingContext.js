import { createContext } from "react";

export const PlayingContext = createContext();
export let socket = new WebSocket(`wss://rankedwebsocketapi.fly.dev/`);
export function restartSocket(){
    if(socket.readyState == 3){
        socket = new WebSocket(`wss://rankedwebsocketapi.fly.dev/`);
    }
}
