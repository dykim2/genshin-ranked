import { createContext } from "react";

export const PlayingContext = createContext();
export let socket = new WebSocket("ws://localhost:3000");
export function restartSocket(){
    if(socket.readyState == 3){
        socket = new WebSocket("ws://localhost:3000");
    }
}
