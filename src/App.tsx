import "./App.css";
import WebRouter from "./setup/WebRouter.tsx";
import React, {useState, useRef, useEffect} from "react";
import CharacterContext from "./contexts/CharacterContext.ts";
import PlayerInfo from "./interfaces/PlayerInfoInterface.tsx";

const App = () => {
  const [characters, setCharacters] = useState<PlayerInfo[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  // push the socket up even higher, to ideally prevent it from being created again
  const api_choice = [
    "https://rankedapi-late-cherry-618.fly.dev",
    "http://localhost:3000",
  ];
  const api = api_choice[0];
  const getChars = async () => {
    let charData = await fetch(`${api}/charAPI/all`, {
      method: "GET",
    });
    let oldResult: any[] = await charData.json();
    let result: PlayerInfo[] = oldResult[0];
    let arr: PlayerInfo[] = []; // to sort the characters alphabetically
    // remove the character with name "N/A"
    result.map((char: PlayerInfo) => {
      return char._id >= 0 ? arr.push(char) : null;
    });
    arr.sort(compare);
    setCharacters(arr);
    sessionStorage.setItem("characters", JSON.stringify(arr));
    console.log("done done done done done");
  };
  useEffect(() => {
    getChars();
  }, []);
  // obtain data here instead, i only need to grab it once anyways
  const compare = (one: PlayerInfo, two: PlayerInfo): number => {
    // compare characters
    if (one._id < two._id) {
      return -1;
    } else if (one._id > two._id) {
      return 1;
    } else {
      return 0;
    }
  };
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
    // console.log("making a new socket connection");
    socketRef.current = new WebSocket(socketOpts[0]);
  }
  return (
    <div className="font">
      <div className="background"></div>
      <div className="main-content" style={{ color: "white", fontSize: 24 }}>
        <CharacterContext.Provider value={characters}>
          <WebRouter socket={socketRef.current} />
        </CharacterContext.Provider>
      </div>
    </div>
  );
}
export default App;