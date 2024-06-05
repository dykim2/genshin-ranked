import "./App.css";
import WebRouter from "./setup/WebRouter";
import {useState} from "react";
import CharacterContext from "./contexts/CharacterContext";
import ActiveContext from "./contexts/ActiveContext";
function App() {
  document.body.style = "background: black";
  const [characters, setCharacters] = useState([]);
  const [active, setActive] = useState([]);
  return (
    <div className="font">
      <div style={{ color: "white", fontSize: 24 }}>
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