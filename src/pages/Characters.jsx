import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CharacterContext from "../contexts/CharacterContext";

export default function Characters() {
  // api implemented, uploading data next
  const [chars, setChars] = useContext(CharacterContext);
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const wait = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log("wait");
    }, 2000);
  };
  // <button disabled={refreshing} style={{fontSize: 24, marginLeft: "300px", color: "red", backgroundColor: "transparent", outlineColor: "red"}} onClick={() => {}}>{refreshing ? "Please wait to refresh" : "Click me to refresh"}</button>
  return (
    <div style={{ color: "white" }}>
      <p>
        Choose a character to see more about them and their restrictions for
        ranked play!
      </p>

      {chars.map((char) => {
        return char._id < 0 || typeof char._id == "undefined" ? null : (
          <Link
            style={{ color: chooseColor(char.element) }}
            key={char.name}
            to={`/characters/${char.name}`}
          >
            <br />
            {char.name}
          </Link>
        );
      })}
    </div>
  );
}

function chooseColor(elem) {
  const elements = ["pyro", "cryo", "hydro", "electro", "dendro", "anemo", "geo"];
  const colors = ["#EC4923", "#4682B4", "#00BFFF", "#945DC4", "#608a00", "#359697", "#DEBD6C"]
  for(let i = 0; i < elements.length; i++){
    if(elem.toLowerCase() === elements[i]){
      return colors[i];
    }
  }
  return "#FFFFFF" // white by default and for traveler
}