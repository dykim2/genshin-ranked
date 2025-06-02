import "./App.css";
import WebRouter from "./setup/WebRouter.tsx";
import React, {useState, useRef} from "react";
import CharacterContext from "./contexts/CharacterContext.js";
import ActiveContext from "./contexts/ActiveContext.js";

function App() {
  const [characters, setCharacters] = useState([]);
  const [active, setActive] = useState([]);
  const socketRef = useRef<WebSocket | null>(null);
  // push the socket up even higher, to ideally prevent it from being created again
  let userId = localStorage.getItem("userid");
  if (userId == null) {
    userId = crypto.randomUUID();
    localStorage.setItem("userid", userId);
  }
  let socketOpts = [
    `wss://rankedwebsocketapi.fly.dev?userId=${userId}`,
    `ws://localhost:3000?userId=${userId}`,
  ];
  if (
    !socketRef.current ||
    socketRef.current.readyState === WebSocket.CLOSED ||
    socketRef.current.readyState === WebSocket.CLOSING
  ) {
    socketRef.current = new WebSocket(socketOpts[0]);
  }
  return (
    <div className="font">
      <div className="fullscreen-container" style={{ color: "white", fontSize: 24 }}>
        <CharacterContext.Provider value={[characters, setCharacters]}>
            <ActiveContext.Provider value={[active, setActive]}>
              <WebRouter socket={socketRef.current} />
            </ActiveContext.Provider>
        </CharacterContext.Provider>
      </div>
    </div>
  );
}
export default App;