import "./App.css";
import WebRouter from "./setup/WebRouter";
import {useState, useEffect} from "react";
import CharacterContext from "./contexts/CharacterContext";
import PlayingContext from "./contexts/PlayingContext";
import IdentityContext from "./contexts/IdentityContext";
function App() {
  document.body.style = "background: black";
  const [characters, setCharacters] = useState([]);
  const [playInfo, setInfo] = useState({});
  const [identity, setIdentity] = useState({});
  useEffect(() => {
    fetch("https://rankedapi-late-cherry-618.fly.dev/charAPI/", {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data[0]);
      });
    // obtain list of characters, save them to a context
  }, []);
  return (
    <div style={{ color: "white", fontSize: 24 }}>
      <CharacterContext.Provider value={characters}>
        <PlayingContext.Provider value={[playInfo, setInfo]}>
          <IdentityContext.Provider value={[identity, setIdentity]}>
            <WebRouter />
          </IdentityContext.Provider>
        </PlayingContext.Provider>
      </CharacterContext.Provider>
    </div>
  );
}
export default App;
