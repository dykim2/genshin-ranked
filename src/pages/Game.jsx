import {useState, useEffect, useContext, useRef, useMemo, useCallback} from "react";
import IdentityContext from "../contexts/IdentityContext.js";
import "./css/Playing.css";
import "./css/Gameplay.css";
import CharacterContext from "../contexts/CharacterContext.js";
import Tooltip from "@mui/material/Tooltip";
export default function Game(props){
    // the actual meat of the game, including picks / bans / etc
    const IMG_SIZE = 75;
    const [identity, setIdentity] = useContext(IdentityContext);
    const [characters, setCharacters] = useContext(CharacterContext);
    const [selection, setSelection] = useState(""); // what character they choose
    const [bosses, setBosses] = useState([]);
    const [showInfo, setShow] = useState("character"); // show bosses, characters, or neither (character, boss, none)
    const [update, setUpdate] = useState(false);
    let socket;
    useEffect(() => {
      // setup the socket
      socket = new WebSocket("https://rankedwebsocketapi.fly.dev/");
      console.log("yikes opening");
      socket.addEventListener("open", function (event) {
        if (
          JSON.stringify(identity) ==
            JSON.stringify({ connected: [0, 0, 0] }) ||
          typeof identity == "undefined"
        ) {
          // fetch the game by sending a message to the websocket server
          socket.send(
            JSON.stringify({
              type: "get",
              id: props.id,
            })
          );
        } 
      });

      // Listen for messages
      socket.addEventListener("message", function (event) {
        let data = JSON.parse(event.data);
        if(data.message.toLowerCase() != "success"){
          throw new Error("An error happened getting data from the server. Please report this!")
        }
        switch (data.type) {
          case "create": {
            setIdentity(data.game);
            break;
          }
          case "get":
            setIdentity(data.game);
            break;
          case "boss": {
            setIdentity((iden) => ({
              ...iden,
              bosses: [...iden.bosses, data.boss],
            }));
            break;
          }
          case "ban": {
            // check accordingly
            setIdentity((iden) => ({
              ...iden,
              bans: [...iden.bosses, data.ban],
            }));
            break;
          }
          case "pick": {
            if (data.team == 1) {
              setIdentity((iden) => ({
                ...iden,
                pickst1: [...iden.pickst1, data.pickst1],
              }));
            } else {
              setIdentity((iden) => ({
                ...iden,
                pickst2: [...iden.pickst2, data.pickst2],
              }));
            }
            break;
          }
          case "times":{
            // info.data is in format of a three digit array: [team (1 or 2), boss number (0 to 6 or 8 depends on division), new time]
            if (data[0] == 1) {
              let newTimes = [...timest1];
              newTimes[data[1]] = data[2];
              setIdentity((iden) => ({
                ...iden, 
                timest1: newTimes
              }))
            } else {
              let newTimes = [...timest2];
              newTimes[data[1]] = data[2];
              setIdentity((iden) => ({
                ...iden,
                timest2: newTimes,
              }));
            }
            break;
          }
          case "switch":{
            setIdentity((iden) => ({
              ...iden,
              phase: newPhase,
            }));
            break;
          }
        }
        setUpdate((upd) => !upd); // should refresh state when a new message arrives
        // initial setup / get call should return the information
        // send props when navigating
      });
      socket.addEventListener("close", function (event) {
        console.log("closed");
        socket.close();
        // throw an error that connection closed?
      });
      socket.addEventListener("error", function (event) {
        console.log("An error occured");
        console.log(event.data);
        socket.close();
      });

      // get the boss options
      fetch("https://rankedapi-late-cherry-618.fly.dev/bossAPI/all", {
        method: "GET"
      })
      .then(res => res.json())
      .then(data => {
        setBosses(data[0]);
      })
      
      // check that identity is not the default value
      // if it is, fetch the game from the id
      
    }, [])

    // websocket functions
    
    // websocket will handle most of the todos

    // split the page into three parts, 25% / 50% / 25%
    const CharList = useCallback(() => {
      console.log("re-render characters")
      return characters.map((char) => {
        return (
          <Tooltip title={char.name} key={char._id} arrow>
            <img
              width={IMG_SIZE}
              height={IMG_SIZE}
              src={char.icon}
              onClick={() => setSelection(char.name)}
              style={{
                backgroundColor: char.name == selection ? "red" : "transparent",
              }}
            />
          </Tooltip>
        );
      });
    }    
  )
    const BossList = useCallback(() => {
      return bosses.map((boss) => {
        return (
          <Tooltip key={boss._id} title={boss.boss} arrow>
            <img
              width={IMG_SIZE}
              height={IMG_SIZE}
              src={boss.icon}
              onClick={() => setSelection(boss.boss)}
              style={{
                backgroundColor: boss.boss == selection ? "red" : "transparent",
              }}
            />
          </Tooltip>
        );
      })
    })
    const styles = {
      splitScreen: {
        display: "flex",
        flexDirection: "row"
      },
      top: {
        width: "35%",
      },
      center: {
        width: "30%",
      },
      bottom: {
        width: "35%",
      },
    };
    let valuesArr = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
    return (
      <div className="container">
        <div className="grid one">
          {typeof identity.team1 == "undefined" ? "Team 1!" : identity.team1}
        </div>
        <div className="grid two">
          {showInfo == "boss" ? "Bosses:" : "Characters:"}
        </div>
        <div className="grid three">3</div>
        <div className="grid four">4</div>
        <div className="grid five">
          <div className="grid six">
            <div>{showInfo == "boss" ? <BossList /> : null}</div>
            <div>{showInfo == "character" ? <CharList /> : null}</div>
          </div>
        </div>
        <div className="grid seven">7</div>
        <div className="grid eight">8</div>
        <div className="grid nine">
          <p className="sub-left">{`Currently selected: ${selection}`}</p>
          <button className="sub-center-right">Select</button>
          <button className="sub-center-left" onClick={() => {
                showInfo == "character"
                  ? setShow("boss")
                  : setShow("character");
              }}>Swap</button>
        </div>
        <div className="grid ten">10</div>
        <div className="grid eleven">
          <p className="sub-left">bans:</p>
          <p className="sub-center-left">yes</p>
          <p className="sub-center-right">11</p>
          <p className="sub-right">11.5</p>
        </div>
        <div className="grid twelve">12</div>
        <div className="grid thirteen">
          <p className="sub-left">bans:</p>
          <p className="sub-center-left">yes</p>
          <p className="sub-center-right">11</p>
          <p className="sub-right">11.5</p>
        </div>
      </div>
    );
}
/*
  team 1 bans
*/

/*
 placeholder for code

 <div style={styles.splitScreen}>
        <div style={styles.top}>
          <p style={{ textAlign: "center" }}>
            {typeof identity.team1 == "undefined" ? "Team 1!" : identity.team1}
          </p>
          <div
            style={{
              marginTop: 1000,
              flexDirection: "row"
            }}
          >
            <p style={{ backgroundColor: "red", fontSize: 35, width: "10%", flex: 1 }}>test</p>
            <p style={{ backgroundColor: "green", fontSize: 35, width: "10%", flex: 1}}>test2</p>
          </div>
        </div>
        <div style={styles.center}>
          <p style={{ textAlign: "center", marginBottom: 100 }}>
            {showInfo == "boss" ? "Bosses" : "Characters"}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div>{showInfo == "boss" ? <BossList /> : null}</div>
            <div>{showInfo == "character" ? <CharList /> : null}</div>
          </div>
          <p style={{ marginTop: 50, fontSize: 24, textAlign: "center" }}>
            {`Currently selected: ${selection}`}
          </p>
          <div
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                marginTop: 100,
                fontSize: 24,
              }}
              onClick={() => {
                showInfo == "character"
                  ? setShow("boss")
                  : setShow("character");
              }}
            >
              Switch!
            </button>
          </div>
        </div>
        <div style={styles.bottom}>
          <p
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {typeof identity.team2 == "undefined" ? "Team 2!" : identity.team2}
          </p>
          {
            // picks
          }
        </div>
      </div>
*/