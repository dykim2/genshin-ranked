import { useState, useEffect, useContext, useCallback, Fragment } from "react";
import { useCookies } from "react-cookie";
import "./css/Playing.css";
import "./css/Gameplay.css";
import CharacterContext from "../contexts/CharacterContext.js";
import Tooltip from "@mui/material/Tooltip";
import { PlayingContext } from "../contexts/PlayingContext.js";
const IMG_SIZE = 75;
const gameInfo = () => JSON.parse(sessionStorage.getItem("game")) || "yikes";
const charInfo = () => JSON.parse(sessionStorage.getItem("characters")) || [];
const swapToBansPickIndex = 2; // can change in future games :eyes:

const findBosses = async () => {
  let bosses = await fetch(
    "https://rankedapi-late-cherry-618.fly.dev/bossAPI/all",
    {
      method: "GET",
    }
  );
  bosses = await bosses.json();
  return bosses[0];
};
function MyTurn(turnInfo, id) {
  const [cookieInfo, setCookie] = useCookies(["player"]);
  if ("" + turnInfo.turnInfo == cookieInfo.player.substring(0, 1)) {
    return <p style={{ color: "red" }}>YOUR TURN!</p>;
  } else if (
    (cookieInfo.player.substring(0, 1) == "1" ||
      cookieInfo.player.substring(0, 1) == "2") &&
    turnInfo.turnInfo > 0
  ) {
    return <p style={{ color: "red" }}>Opponent's turn!</p>;
  } else {
    return (
      <p style={{ color: "red" }}>It is team {turnInfo.turnInfo}'s turn!</p>
    );
  }
}
const forwardTimes = () => {
  console.log("yes");
};
const parseBoss = (data) => {
  // takes in a copy of local storage usestate
  // takes in a copy of data
  // returns the value to add to sessionStorage
  // find first boss
  const identity = JSON.parse(sessionStorage.getItem("game"));
  console.log("----------");
  console.log(identity);
  const bossList = JSON.parse(sessionStorage.getItem("bosses"));
  let nextArr = [0, 2, 1];
  let newBosses = [...identity.bosses];
  for (let i = 0; i < identity.bosses.length; i++) {
    if (identity.bosses[i]._id == -1) {
      newBosses[i] = bossList[data.boss];
      break;
    }
  }
  let returnVal = "";
  if (data.nextTeam == -1) {
    alert(
      "Team 2 has selected " + bossList[data.boss].boss + " for their boss!"
    );
    returnVal = {
      ...identity,
      result: "ban",
      bosses: newBosses,
      turn: 1,
    };
  } else {
    alert(
      "Team " +
        nextArr[data.nextTeam] +
        " has selected  " +
        bossList[data.boss].boss +
        " for their boss!"
    );
    returnVal = {
      ...identity,
      bosses: newBosses,
      turn: data.nextTeam,
    };
  }
  console.log("return");
  console.log(returnVal);
  return returnVal;
};
function compare(one, two) {
  // compare characters
  if (one._id == "undefined") {
    throw new Error("Please only compare characters.");
  }
  if (one._id < two._id) {
    return -1;
  } else if (one._id > two._id) {
    return 1;
  } else {
    return 0;
  }
}
const parseBan = (data) => {
  const charList = charInfo();
  const identity = JSON.parse(sessionStorage.getItem("game"));
  // check accordingly
  let newBans = [...identity.bans];
  let nextArr = [0, 2, 1];
  let index = -1;
  for (let i = 0; i < identity.bans.length; i++) {
    if (identity.bans[i]._id == -1) {
      for (let j = 0; j < charList.length; j++) {
        if (charList[j]._id == data.ban) {
          newBans[i] = charList[j];
          index = j;
          break;
        }
      }
      break;
    }
  }
  if (data.nextTeam == -2) {
    alert("Team 2 has banned " + charList[index].name + "!");
    socket.send(JSON.stringify({
      type: "phase",
      phase: "pick"
    }))
    return {
      ...identity,
      bans: newBans,
      result: "pick",
      turn: 1,
    };
  } else if (data.nextTeam == -1) {
    alert("Team 1 has banned " + charList[index].name + "!");
    return {
      ...identity,
      bans: newBans,
      result: "pick",
      turn: 2,
    };
  } else {
    alert(
      "Team " +
        nextArr[data.nextTeam] +
        " has banned " +
        charList[index].name +
        "!"
    );
    return {
      ...identity,
      bans: newBans,
      turn: data.nextTeam,
    };
  }
};
const parsePick = (data) => {
  const charList = charInfo();
  const identity = JSON.parse(sessionStorage.getItem("game"));
  let returnInfo = "";
  let index = -1;
  if (data.team == 1) {
    let newPicks = [...identity.pickst1];
    for (let i = 0; i < identity.pickst1.length; i++) {
      if (identity.pickst1[i]._id == -1) {
        for (let j = 0; j < charList.length; j++) {
          if (charList[j]._id == data.pick) {
            newPicks[i] = charList[j];
            index = j;
            break;
          }
        }
        break;
      }
    }
    returnInfo = {
      ...identity,
      pickst1: newPicks,
      turn: data.nextTeam,
    };
  } else {
    let newPicks = [...identity.pickst2];
    for (let i = 0; i < identity.pickst2.length; i++) {
      if (identity.pickst2[i]._id == -1) {
        for (let j = 0; j < charList.length; j++) {
          if (charList[j]._id == data.pick) {
            newPicks[i] = charList[j];
            index = j;
            break;
          }
        }
        break;
      }
    }
    returnInfo = {
      ...identity,
      pickst2: newPicks,
      turn: data.nextTeam,
    };
  }
  // console.log("index: "+index)
  if (data.nextTeam == -1) {
    // picks are over
    console.log("sent from parsepick");
    returnInfo = {
      ...returnInfo,
      result: "play",
      turn: -1,
    };
    alert("Team 1 has selected " + charList[index].name + "!");
    // switch phase on socket
    socket.send(JSON.stringify({
      type: "phase",
      phase: "progress"
    }))
  } else if (data.nextTeam == -2) {
    // second phase of bans
    alert("Team 2 has selected " + charList[index].name + "!");
    returnInfo = {
      ...returnInfo,
      result: "ban",
      turn: 2,
    };
    socket.send(
      JSON.stringify({
        type: "phase",
        phase: "ban",
      })
    );
  } else {
    alert("Team " + data.team + " has selected " + charList[index].name + "!");
  }
  return returnInfo;
};
const parseTimes = (identity, data) => {
  if (data[0] == 1) {
    let newTimes = [...timest1];
    newTimes[data[1]] = data[2];
    return {
      ...identity,
      timest1: newTimes,
    };
  } else {
    let newTimes = [...timest2];
    newTimes[data[1]] = data[2];
    return {
      ...identity,
      timest2: newTimes,
    };
  }
};

export default function Game(props) {
  // the actual meat of the game, including picks / bans / etc
  const [identity, setIdentity] = useState(gameInfo());
  const [characters, setCharacters] = useContext(CharacterContext);
  const [selection, setSelection] = useState(""); // what character they choose
  const [showInfo, setShow] = useState("boss"); // show bosses, characters, or neither (character, boss, none)
  // const [update, setUpdate] = useState(false);
  const [bosses, setBosses] = useState(
    JSON.parse(sessionStorage.getItem("bosses"))
  );
  const [turn, setTurn] = useState(1); // current turn
  const [cookies, setCookie] = useCookies(["player"]);
  const socket = useContext(PlayingContext);
  // https://rankedwebsocketapi.fly.dev/
  const updateIdentity = (info) => {
    sessionStorage.setItem("game", JSON.stringify(info));
    setIdentity(info);
  };

  /*
  useEffect(() => {
    sessionStorage.setItem("game", JSON.stringify(identity));
  }, [identity])
  */

  const sendSelection = (teamNum, selection) => {
    let gameID = props.id;
    // use the selection variable
    if (JSON.stringify(identity) == JSON.stringify({ connected: [0, 0, 0] })) {
      console.log("identity error");
      return;
    }
    // boss, pick, etc
    let res = identity.result;
    let req = "";
    if (res.toLowerCase() == "waiting") {
      req = JSON.stringify({
        id: gameID,
        type: "add",
        changed: "boss",
        data: {
          character: selection.id,
          boss: selection.id,
          team: teamNum,
        },
      });
    } else {
      req = JSON.stringify({
        id: gameID,
        type: "add",
        changed: identity.result,
        data: {
          character: selection.id,
          boss: selection.id,
          team: teamNum,
        },
      });
    }
    console.log("sent from sendselection");
    socket.send(req);
  };
  useEffect(() => {
    // setup the socket
    /*
        current todos:
        - add buttons and modal to let refs add times
        - test, test, TEST
        - fix no alert on last pick

        later todo (immediate next priority once site is up)
        - return game id with websocket
        - ensure games are independent

        later later todo
        - add re-ordering
    */
   socket.addEventListener("open", function(event) {
    socket.send(JSON.stringify({
      type: "get",
      id: props.id
    }))
    // get updated bosses / characters too?
    socket.send(
      JSON.stringify({
        type: "find",
        query: "boss"
    }))
    socket.send(
      JSON.stringify({
        type: "find",
        query: "character"
      })
    );
   })

    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log(JSON.parse(event.data));
      console.log("^^^^");
      let data = JSON.parse(event.data);
      if (data.message.toLowerCase() != "success") {
        console.log(data);
        throw new Error(
          "An error happened getting data from the server. Please report this!"
        );
      }
      if(data.id != props.id){
        return; // do nothing if game does not match
      }
      let res = null;
      switch (data.type) {
        case "create": {
          updateIdentity(data.game);
          break;
        }
        case "get": {
          updateIdentity(data.game);
          console.log("game added?");
          console.log(data.game);
          setTurn(data.game.turn);
          break;
        }
        case "turn": {
          setTurn(data.turn);
          break;
        }
        case "boss": {
          updateIdentity(data.game); // pain to continuously override game, but this ensures no one can mess with it and have their changes saved locally
          parseBoss(data);
          break;
        }
        case "ban": {
          updateIdentity(data.game);
          parseBan(data, characters);
          break;
        }
        case "pick": {
          updateIdentity(data.game);
          parsePick(data, characters);
          break;
        }
        case "times": {
          // info.data is in format of a three digit array: [team (1 or 2), boss number (0 to 6 or 8 depends on division), new time]
          updateIdentity(data.game);
          parseTimes(identity, data);
          res = null;
          break;
        }
        case "query": {
          if(data.boss){
            setBosses(data.bossList);
          }
          else{
            setCharacters(data.characterList);
          }
        }
        case "switch": {
          /*
            updateIdentity((iden) => ({
              ...iden,
              result: newPhase,
            }));
            */
          break;
        }
      }
      if (res != null) {
        updateIdentity(res);
        setTurn(res.turn);
      }
      console.log("sent");
    });
    socket.addEventListener("close", function (event) {
      console.log("closed");
      socket.close();
    });
    socket.addEventListener("error", function (event) {
      console.log("An error occured");
      console.log(event.data);
      socket.close();
    });

    return () => {
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, []);

  // split the page into three parts, 25% / 50% / 25% (ish - grid takes cares of this)
  let picks = [0, 2, 4, 6, 8, 1, 3, 5, 7];
  let bans = [0, 2, 5, 1, 3, 4];
  return (
    <div>
      <div className="container">
        <div className="grid one">
          {typeof identity.team1 == "undefined"
            ? "Team 1 Selections!"
            : identity.team1 + " picks!"}
        </div>
        <div className="grid newgrid two">
          <p className="boss boss-1">
            {showInfo == "boss" ? "Bosses:" : "Characters:"}
          </p>
          <div className="boss boss-2">
            <MyTurn turnInfo={turn == 1 ? 1 : 2} />
          </div>
          <p className="boss boss-3">
            {"Currently choosing: " + identity.result.toUpperCase()}
          </p>
        </div>
        <div className="grid three">
          {typeof identity.team2 == "undefined"
            ? "Team 2 Selections!"
            : identity.team2 + " picks!"}
        </div>
        <div className="grid four">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => {
            if (val >= 6) {
              return (
                <p key={val} className={`pick pick-${4 * val - 23}`}>
                  {typeof identity.playerst1 == "undefined" ||
                  typeof identity.playerst1[val - 6] == "undefined"
                    ? "player " + (val - 5)
                    : identity.playerst1[val - 6]}
                </p>
              );
            } else {
              return (
                <Fragment key={val}>
                  <p className={`pick pick-${2 * val + 2}`}>
                    {typeof identity.pickst1 == "undefined" ||
                    typeof identity.pickst1[val] == "undefined"
                      ? "pick " + (val + 1)
                      : identity.pickst1[val].name}
                  </p>
                  <img
                    className={`pick pick-${val + 13}`}
                    width={IMG_SIZE}
                    height={IMG_SIZE}
                    src={
                      typeof identity.pickst1 == "undefined" ||
                      typeof identity.pickst1[val] == "undefined"
                        ? null
                        : identity.pickst1[val].icon
                    }
                  />
                </Fragment>
              );
            }
          })}
        </div>
        <div className="grid five">
          <div>
            {showInfo == "boss"
              ? useCallback(
                  bosses.map((boss) => {
                    return (
                      <Tooltip key={boss._id} title={boss.boss} arrow>
                        <img
                          width={IMG_SIZE}
                          height={IMG_SIZE}
                          src={boss.icon}
                          onClick={() => {
                            setSelection({
                              type: "boss",
                              id: boss._id,
                              name: boss.boss,
                            });
                          }}
                          style={{
                            backgroundColor:
                              boss._id == selection.id &&
                              selection.type == "boss"
                                ? "red"
                                : "transparent",
                            margin: 5,
                          }}
                        />
                      </Tooltip>
                    );
                  })
                )
              : null}
          </div>
          <div>
            {showInfo == "character"
              ? useCallback(
                  characters.map((char) => {
                    return (
                      <Tooltip title={char.name} key={char._id} arrow>
                        <img
                          width={IMG_SIZE}
                          height={IMG_SIZE}
                          src={char.icon}
                          onClick={() => {
                            setSelection({
                              type: "character",
                              id: char._id,
                              name: char.name,
                            });
                          }}
                          style={{
                            backgroundColor:
                              char._id == selection.id &&
                              selection.type == "character"
                                ? "red"
                                : "transparent",
                            margin: 5,
                          }}
                        />
                      </Tooltip>
                    );
                  })
                )
              : null}
          </div>
        </div>
        <div className="grid seven">
          {[0, 1, 2].map((val) => {
            return (
              <div key={val} className={`pick pick-${4 * val + 1}`} style={{textAlign:"center"}}>
                <p>
                  {typeof identity.playerst2 == "undefined" ||
                  typeof identity.playerst2[val] == "undefined"
                    ? "player " + (val + 1)
                    : identity.playerst2[val]}
                </p>
              </div>
            );
          })}
          {[0, 1, 2, 3, 4, 5].map((val) => {
            return (
              <div
              key={val}
              className={`pick pick-${2 * val + 2}`}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
                <p
              // className={`pick pick-${2 * val + 2}`}
              >
                  {typeof identity.pickst2 == "undefined" ||
                  typeof identity.pickst2[val] == "undefined"
                    ? "pick " + (val + 1)
                    : identity.pickst2[val].name}
                </p>
                <img
                  key={val}
                  // className={`pick pick-${2 * val + 2}`}
                // className={`pick pick-${val + 13}`}
                  style={{paddingLeft: "5px" }}
                width={IMG_SIZE}
                  height={IMG_SIZE}
                  src={
                    typeof identity.pickst2 == "undefined" ||
                    typeof identity.pickst2[val] == "undefined"
                      ? null
                      : identity.pickst2[val].icon
                  }
                />
              </div>
            );
          })}
        </div>
        <div className="grid newgrid eight">
          {cookies.player.charAt(0) == "1" ? (
            <button className="boss-1">Adjust player picks</button>
          ) : cookies.player.charAt(0) == "r" ? (
            <button>Add T2 times</button>
          ) : null}
        </div>
        <div className="grid nine">
          <p className="boss-1">{`Currently selected: ${selection.name}`}</p>
          <button
            className="boss-3"
            onClick={() => {
              sendSelection(turn, selection);
            }}
            disabled={turn + "" != cookies.player.charAt(0)} //
          >
            Select
          </button>
          <button
            className="boss-2"
            onClick={() => {
              {
                showInfo == "character"
                  ? setShow("boss")
                  : setShow("character");
              }
            }}
          >
            {showInfo == "character" ? "Show Bosses" : "Show Characters"}
          </button>
        </div>

        <div className="grid newgrid ten">
          {cookies.player.charAt(0) == "2" ? (
            <button className="boss-1">Adjust player picks</button>
          ) : cookies.player.charAt(0) == "r" ? (
            <button>Add T1 times</button>
          ) : null}
        </div>
        <div className="grid newgrid eleven">
          <p className="boss boss-1">bans:</p>
          {bans.slice(0, 3).map((ban) => {
            return (
              <Tooltip
                title={
                  typeof identity.bans == "undefined"
                    ? null
                    : identity.bans[ban].name
                }
                arrow
                key={ban}
              >
                <img
                  className={`boss ban-${ban}`}
                  width={IMG_SIZE}
                  height={IMG_SIZE}
                  src={identity.bans[ban].icon}
                />
              </Tooltip>
            );
          })}
        </div>
        <div className="grid newgrid twelve">
          <p className="boss boss-1">Bosses: </p>
          {picks.map((pick) => {
            return typeof identity.bosses == "undefined" ||
              typeof identity.bosses[pick] == "undefined" ? null : (
              <Tooltip title={identity.bosses[pick].boss} arrow key={pick}>
                <img
                  className={`boss boss-${pick + 2}`}
                  width={IMG_SIZE}
                  height={IMG_SIZE}
                  src={identity.bosses[pick].icon}
                />
              </Tooltip>
            );
          })}
        </div>
        <div className="grid newgrid thirteen">
          <p className="boss boss-1">bans:</p>
          {bans.slice(3, 6).map((ban) => {
            return typeof identity.bans == "undefined" ||
              typeof identity.bans[ban] == "undefined" ? null : (
              <Tooltip title={identity.bans[ban].name} arrow key={ban}>
                <img
                  className={`boss ban-${ban}`}
                  width={IMG_SIZE}
                  height={IMG_SIZE}
                  src={identity.bans[ban].icon}
                />
              </Tooltip>
            );
          })}
        </div>
        <div className="grid newgrid fifteen">
          <p className="boss boss-1">T1 times: </p>
          {picks.map((pick) => {
            return typeof identity.timest1 == "undefined" ||
              typeof identity.timest1[pick] == "undefined" ? null : (
              <p className={`boss boss-${pick + 2}`} key={pick}>
                {identity.timest1[pick]}
              </p>
            );
          })}
        </div>
        <div className="grid newgrid sixteen">
          <p className="boss boss-1">T2 times: </p>
          {picks.map((pick) => {
            return typeof identity.timest2 == "undefined" ||
              typeof identity.timest2[pick] == "undefined" ? null : (
              <p className={`boss boss-${pick + 2}`} key={pick}>
                {identity.timest2[pick]}
              </p>
            );
          })}
        </div>
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
