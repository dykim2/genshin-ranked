import "./App.css";
import WebRouter from "./setup/WebRouter";
import {useState, useEffect, useContext} from "react";
import CharacterContext from "./contexts/CharacterContext";
import PlayingContext from "./contexts/PlayingContext";
import IdentityContext from "./contexts/IdentityContext";
import ActiveContext from "./contexts/ActiveContext";
function App() {
  document.body.style = "background: black";
  const [characters, setCharacters] = useState([]);
  const [playInfo, setInfo] = useState({});
  const [identity, setIdentity] = useState({connected: [0,0,0]});
  const [active, setActive] = useState([]);
  return (
    <div className="font">
      <div style={{ color: "white", fontSize: 24 }}>
        <CharacterContext.Provider value={[characters, setCharacters]}>
          <PlayingContext.Provider value={[playInfo, setInfo]}>
            <IdentityContext.Provider value={[identity, setIdentity]}>
              <ActiveContext.Provider value={[active, setActive]}>
                <WebRouter />
              </ActiveContext.Provider>
            </IdentityContext.Provider>
          </PlayingContext.Provider>
        </CharacterContext.Provider>
      </div>
    </div>
  );
}
export default App;