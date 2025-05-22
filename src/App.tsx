import "./App.css";
import WebRouter from "./setup/WebRouter.tsx";
import React, {useState} from "react";
import CharacterContext from "./contexts/CharacterContext.js";
import ActiveContext from "./contexts/ActiveContext.js";

function App() {
  const [characters, setCharacters] = useState([]);
  const [active, setActive] = useState([]);
  return (
    <div className="font">
      <div className="fullscreen-container" style={{ color: "white", fontSize: 24 }}>
        <CharacterContext.Provider value={[characters, setCharacters]}>
            <ActiveContext.Provider value={[active, setActive]}>
              <WebRouter />
            </ActiveContext.Provider>
        </CharacterContext.Provider>
      </div>
    </div>
  );
}
export default App;