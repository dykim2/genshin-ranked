import "./App.css";
import WebRouter from "./setup/WebRouter";
import {useState, useEffect, useContext} from "react";
import CharacterContext from "./contexts/CharacterContext";
function App() {
  document.body.style = "background: black";
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    fetch("https://rankedapi-late-cherry-618.fly.dev/charAPI/", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data[0]);
      });
    // obtain list of characters, save them to a context
  }, []);
  return (
    <div style={{color: "white", fontSize: 24}}>
      <CharacterContext.Provider value={characters}>
        <WebRouter />
      </CharacterContext.Provider>
    </div>
  );
}
export default App;
