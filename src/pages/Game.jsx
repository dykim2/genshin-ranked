import { useState, useEffect, useContext, useCallback, Fragment } from "react";
import { useCookies } from "react-cookie";
import { Box } from "@mui/material";
import "./css/Playing.css";
import "./css/Gameplay.css";
import CharacterContext from "../contexts/CharacterContext.js";
import Tooltip from "@mui/material/Tooltip";
import { PlayingContext } from "../contexts/PlayingContext.js";
import TimesModal from "./TimesModal.jsx";
import OrderModal from "./OrderModal.jsx";
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

const parseBoss = (data) => {
  // takes in a copy of local storage usestate
  // takes in a copy of data
  // returns the value to add to sessionStorage
  // find first boss
  const identity = JSON.parse(sessionStorage.getItem("game"));
  const bossList = JSON.parse(sessionStorage.getItem("bosses"));
  let nextArr = [0, 2, 1];
  let newBosses = [...identity.bosses];
  let long = false;
  for (let i = 0; i < identity.bosses.length; i++) {
    if (identity.bosses[i]._id == -1) {
      newBosses[i] = bossList[data.boss];
      if(bossList[data.boss].type == "long"){
        long = true;
      }
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
      type: "switch",
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
        type: "switch",
        phase: "ban",
        id: identity._id,
      })
    );
  } else {
    alert("Team " + data.team + " has selected " + charList[index].name + "!");
  }
  return returnInfo;
};
const parseTimes = (identity, data) => {
  if (data[0] == 1) {
    let newTimes = [...identity.timest1];
    newTimes[data[1]] = data[2];
    console.log("new times: "+newTimes);
    return {
      ...identity,
      timest1: newTimes,
    };
  } else {
    let newTimes = [...identity.timest2];
    newTimes[data[1]] = data[2];
    return {
      ...identity,
      timest2: newTimes,
    };
  }
};
const parseUpdate = (identity, data) => {
  let newIden = null;
  switch(data.team){
    case 1:
      newIden = {
        ...identity,
        playerst1: playerNames,
        team1: teamName
      };
      break;
    case 2:
      newIden = {
        ...identity,
        playerst2: playerNames,
        team2: teamName
      };
      break;
    default:
      newIden = {...identity};
      break;
  }
  console.log(data);
  console.log("----^^^^^----");
  console.log(newIden);
  return newIden;
  // team information
}
const parseStatus = (identity, data) => {
  // update team information 
  let newIden = null;
  switch(data.team){
    case 1:
      switch (data.menu.toLowerCase()) {
        case "penalty": {
          newIden = {
            ...identity,
            penaltyt1: {
              ...identity.penaltyt1,
              [data.bossIndex]: data.status,
            },
          };
          break;
        }
        case "death": {
          newIden = {
            ...identity,
            deatht1: {
              ...identity.deatht1,
              [data.bossIndex]: data.status,
            },
          };
          break;
        }
      }
      break;
    case 2:
      switch (data.menu.toLowerCase()) {
        case "penalty": {
          newIden = {
            ...identity,
            penaltyt2: {
              ...identity.penaltyt2,
              [data.bossIndex]: data.status,
            },
          };
          break;
        }
        case "death": {
          newIden = {
            ...identity,
            deatht2: {
              ...identity.deatht2,
              [data.bossIndex]: data.status,
            },
          };
          break;
        }
      }
      break;
  };
  console.log(data);
  console.log("-------");
  console.log(newIden);
  return newIden;
}

/*
return JSON.stringify({
    message: "Success",
    type: "status",
    menu: info.data.menu,
    team: info.team,
    id: info.id,
    bossIndex: info.data.bossIndex,
    status: info.data.status
  })
 switch(info.team){
    case 1:
      switch(info.menu.toLowerCase()){
        case "penalty": {
          gameInfo.penaltyt1[info.data.bossIndex] = info.data.status;
          gameInfo.markModified('penaltyt1');
          break;
        }
        case "death": {
          gameInfo.deatht1[info.data.bossIndex] = info.data.status;
          gameInfo.markModified('deatht1');
          break;
        }
        default:
          failed = true;
          break;
      }
      break;
    case 2:
      switch (info.menu.toLowerCase()) {
        case "penalty": {
          gameInfo.penaltyt2[info.data.bossIndex] = info.data.status;
          gameInfo.markModified("penaltyt2");
          break;
        }
        case "death": {
          gameInfo.deatht2[info.data.bossIndex] = info.data.status;
          gameInfo.markModified("deatht2");
          break;
        }
        default:
          failed = true;
          break;
      }
      break;
    default:
      failed = true;
      break;
  }
*/

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
  const [turn, setTurn] = useState(identity.turn != undefined ? identity.turn : 1); // current turn
  const [cookies, setCookie] = useCookies(["player"]);
  const socket = useContext(PlayingContext);

  const [showT1Modal, setShowT1] = useState(false);
  const [showT2Modal, setShowT2] = useState(false);

  const [showT1Order, setOrderT1] = useState(false);
  const [showT2Order, setOrderT2] = useState(false);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [chosenBosses, setChosenBosses] = useState([-1]);
  const [chosenChars, setChosenChars] = useState([]);

  // https://rankedwebsocketapi.fly.dev/
  const updateIdentity = (info) => {
    sessionStorage.removeItem('game');
    sessionStorage.setItem("game", JSON.stringify(info));
    setIdentity(info);
  };

  /*
  useEffect(() => {
    sessionStorage.setItem("game", JSON.stringify(identity));
  }, [identity])
  */
  const forwardTimes = (boss, time, team) => {
    console.log("yes");
    if (isNaN(parseFloat(time))) {
      // do error modal thing
      alert("Please enter a valid number or decimal for the time.");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "times",
        id: props.id,
        data: [team, boss, parseFloat(time)],
      })
    );
  };
  /**
   *
   * @param {*} selection the selection information (what boss/pick is chosen)
   * @param {*} type boss or pick (pick counts for both ban and pick)
   */
  const checkCharStatus = (id) => {
    for (let i = 0; i < characters.length; i++) {
      if (characters[i]._id == id) {
        return characters[i].chosen;
      }
    }
  };
  const checkBossStatus = (id) => {
    for (let i = 0; i < bosses.length; i++) {
      if (bosses[i]._id == id) {
        return bosses[i].chosen;
      }
    }
  };
  const checkSelection = (selection, type) => {
    //
    if (selection._id == -1) {
      console.log("none selected");
      return true;
    }
    switch (type) {
      case "boss":
        // check id and check name
        let bossInfo = JSON.stringify(identity.bosses);
        // console.log(bossInfo);
        if (
          bossInfo.includes(`\"_id\":${selection._id},`) ||
          bossInfo.includes(selection.name) ||
          checkBossStatus(selection._id)
        ) {
          console.log("boss fail");
          return false;
        }
        break;
      case "ban":
      case "pick":
        let charInfo =
          JSON.stringify(identity.bans) +
          JSON.stringify(identity.pickst1) +
          JSON.stringify(identity.pickst2);
        if (
          charInfo.includes(`\"_id\":${selection._id},`) ||
          charInfo.includes(selection.name) ||
          checkCharStatus(selection._id)
        ) {
          console.log("pick or ban fail");
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  const sendSelection = (teamNum, selection) => {
    let gameID = props.id;
    // use the selection variable
    // verify the same boss / pick is not already chosen

    if (JSON.stringify(identity) == JSON.stringify({ connected: [0, 0, 0] })) {
      alert("identity error");
      return;
    }
    // boss, pick, etc
    let res = identity.result;
    let req = "";
    if (res.toLowerCase() == "waiting") {
      // check bosses, see if picked
      if (!checkSelection(selection, "boss")) {
        alert(
          "Invalid pick! Please select a BOSS that has not been chosen yet!"
        );
        return;
      }
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
      if (!checkSelection(selection, res)) {
        alert(
          "Invalid pick! Please select a boss (or character) that has not been chosen yet!"
        );
        return;
      }
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
  /**
   * Processes the request to update team information.
   * @param {Number} team the target team to update information for
   * @param {Number} boss the index of the boss to add status for
   * @param {[Boolean]} choice the choice array made by the user (true / false for each of retry, forced retry, etc)
   * @param {String} type either "penalty" or "death" - which menu was chosen
   */
  const updateStatusInfo = (team, boss, choice, type) => {
    // for the specified team, edit the [status] array for the [boss] information by sending a socket request with information [choice] and menu type [type].
    console.log("time to update status info!");
    // return;
    socket.send(
      JSON.stringify({
        type: "status",
        menu: type,
        team: team,
        id: props.id,
        data: {
          bossIndex: boss,
          status: choice,
        },
      })
    );
  };
  /**
   * Checks for valid team information, and if valid, sends it to the socket.
   * @param {Number} team either team 1 or team 2, throws an error if neither
   * @param {[Number]} order the new ordering of picks
   * @param {Object} names the player names
   * @param {String} teamName the name of the team
   */
  const changeTeamInfo = (team, order, names, teamName) => {
    // check valid team and valid team name
    if (teamName.length > 20) {
      // throw error with error modal - team name should not be longer than 20 characters
      return;
    }
    if (order.length != 2 * names.length) {
      // throw error
      return;
    }
    for (let i = 0; i < names.length; i++) {
      if (names[i] == "") {
        team == 1 ? (names[i] = playerst1[i]) : (names[i] = playerst2[i]);
      }
    }
    socket.send(
      JSON.stringify({
        type: "team",
        team: team,
        id: props.id,
        data: {
          teamName: teamName,
          order: order,
          playerNames: names,
        },
      })
    );
  };
  const parseTextColor = (index, team) => {
    let value = 0;
    switch (team) {
      case 1: {
        if (identity.statust1[index] == [false, false, false, false, false]) {
          value += 1;
        }
        if (identity.deatht1[index] == [false, false, false]) {
          value += 2;
        }
        break;
      }
      case 2: {
        if (identity.statust2[index] == [false, false, false, false, false]) {
          value += 1;
        }
        if (identity.deatht2[index] == [false, false, false]) {
          value += 2;
        }
        break;
      }
    }
    switch (value) {
      case 0:
        return {
          color: "white",
        };
      case 1:
        return {
          color: "red",
        };
      case 2:
        return {
          color: "blue",
        };
      case 3:
        return {
          color: "green",
        };
    }
    return {
      color: "white",
    };
  };
  const parseStatusTooltip = (index, team) => {
    let penaltyString = "";
    let deathString = "";
    const penaltyMenu = ["Retry", "DNF", "Ref Error", "VAR", "Forced RT", "Tech"];
    let deathMenu = [];
    switch(team){
      case 1: {
        deathMenu = [...identity.playerst1];
        for (let i = 0; i < identity.statust1[index].length; i++) { // looks like [[false, false, false], [false, false, false]]
          if (identity.statust1[index][i]) {
            penaltyString += penaltyMenu[i] + ", ";
          }
          if (i < identity.playerst1.length && identity.deatht1[index][i]) {
            deathString += deathMenu[i] + ", ";
          }
        }
      }
      case 2: {
        deathMenu = [...identity.playerst2];
        for (let i = 0; i < identity.statust2[index].length; i++) {
          // looks like [[false, false, false], [false, false, false]]
          if (identity.statust2[index][i]) {
            penaltyString += penaltyMenu[i] + ", ";
          }
          if(i < identity.playerst2.length && identity.deatht2[index][i]) {
            deathString += deathMenu[i] + ", ";
          }
        }
      }
    }
    
    return (
      <Fragment>
        <p>
          <b>{`Penalties: `}</b>
          {`${penaltyString}`}
        </p>
        <p>
          <b>{`Deaths: `}</b>
          {`${deathString}`}
        </p>
      </Fragment>
    );
  };
  useEffect(() => {
    // setup the socket
    /*
       current todos day before publish / day of:
       - test
       - test
       - TEST
    */
   
    socket.addEventListener("open", function (event) {
      // this does not load more than once
    });
    if(socket.readyState == 1){
      socket.send(JSON.stringify({
        type: "turn",
        id: props.id,
        getSelectionInfo: true
      }))
    }
    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log(JSON.parse(event.data));
      console.log("^^^^");
      let data = JSON.parse(event.data);
      if (data.message.toLowerCase() == "failure") {
        console.log(data);
        alert(data.error);
        return;
      }
      if (data.id != props.id) {
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
          console.log(data.turn+" new turn on websocket reload")
          setTurn(data.turn);
          if(typeof data.bosses != undefined){
            setChosenBosses(data.bosses);
          }
          if(typeof data.chars != undefined){
            setChosenChars(data.chars)
          }
          break;
        }
        case "boss": {
          res = parseBoss(data);
          let newBossArr = [...chosenBosses]
          newBossArr.push(data.boss);
          setChosenBosses(newBossArr);
          break;
        }
        case "ban": {
          res = parseBan(data, characters);
          let newCharArr = [...chosenChars];
          newCharArr.push(data.ban)
          setChosenChars(newCharArr); // add id to list of chosen
          if(data.nextTeam == -2 || data.nextTeam == -1){
            socket.send(
              JSON.stringify({
                type: "switch",
                phase: "pick",
                id: props.id,
              })
            );
          }
          break;
        }
        case "pick": {
          res = parsePick(data, characters);
          let newCharArr = [...chosenChars];
          newCharArr.push(data.pick);
          setChosenChars(newCharArr);
          if (data.nextTeam == -1) {
            socket.send(
              JSON.stringify({
                type: "switch",
                id: props._id,
                phase: "progress",
              })
            );
          }
          break;
        }
        case "times": {
          console.log("checking times i guess");
          // info.data is in format of a three digit array: [team (1 or 2), boss number (0 to 6 or 8 depends on division), new time]
          res = parseTimes(identity, data.time);
          console.log(res);
          console.log("maybe ^^&")
          break;
        }
        case "query": {
          if (data.boss) {
            sessionStorage.removeItem("bosses");
            setBosses(data.bossList);
            sessionStorage.setItem("bosses", data.bossList);
          } else {
            sessionStorage.removeItem("characters");
            setCharacters(data.characterList);
            sessionStorage.setItem("characters", data.characterList);
          }
          break;
        }
        case "TeamUpdate": {
          res = parseUpdate(identity, data);
          break;
        }
        case "status": {
          res = parseStatus(identity, data);
          break;
        }
        case "switch": {
          updateIdentity((iden) => ({
            ...iden,
            result: newPhase,
          }));
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

  const closeT1Times = () => {
    setShowT1(false);
  };
  const closeT2Times = () => {
    setShowT2(false);
  };
  const closeT1Order = () => {
    setOrderT1(false);
  };
  const closeT2Order = () => {
    setOrderT2(false);
  };
  // split the page into three parts, 25% / 50% / 25% (ish - grid takes cares of this)
  let picks = [0, 2, 4, 6, 8, 1, 3, 5, 7];
  let bans = [0, 2, 5, 1, 3, 4];
  return (
    <div>
      <div className="container">
        <div className="grid one">
          {typeof identity.team1 == "undefined"
            ? "team 1 Selections!"
            : identity.team1 + " picks!"}
        </div>
        <div className="grid newgrid two">
          <p className="boss boss-1">
            {showInfo == "boss" ? "bosses:" : "characters:"}
          </p>
          <div className="boss boss-2">
            <MyTurn turnInfo={turn == 1 ? 1 : 2} />
          </div>
          <p className="boss boss-3">
            {"currently choosing: " + identity.result.toLowerCase()}
          </p>
          <Box className="boss boss-4">{/* add box information */}</Box>
        </div>
        <div className="grid three">
          {typeof identity.team2 == "undefined"
            ? "team 2 Selections!"
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
                      boss._id != -1 ? <Tooltip key={boss._id} title={boss.boss} arrow>
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
                                : chosenBosses.includes(boss._id)
                                ? "black"
                                : "transparent",
                            margin: 5,
                          }}
                        />
                      </Tooltip> : null
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
                                : chosenChars.includes(char._id) 
                                ? "black"
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
              <div
                key={val}
                className={`pick pick-${4 * val + 1}`}
                style={{ textAlign: "center" }}
              >
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
              <Fragment
                key={val}
                // className={`pick pick-${2 * val + 2}`}
                // style={{
                //  display: "flex",
                //  flexDirection: "row",
                //  alignItems: "center",
                //  justifyContent: "end",
                // }}
              >
                <p
                  className={`pick pick-${2 * val + 2}`}
                >
                  {typeof identity.pickst2 == "undefined" ||
                  typeof identity.pickst2[val] == "undefined"
                    ? "pick " + (val + 1)
                    : identity.pickst2[val].name}
                </p>
                <img
                  key={val}
                  // className={`pick pick-${2 * val + 2}`}
                  className={`pick pick-${val + 13}`}
                  width={IMG_SIZE}
                  height={IMG_SIZE}
                  src={
                    typeof identity.pickst2 == "undefined" ||
                    typeof identity.pickst2[val] == "undefined"
                      ? null
                      : identity.pickst2[val].icon
                  }
                />
              </Fragment>
            );
          })}
        </div>
        <div className="grid newgrid eight">
          {cookies.player.charAt(0) == "1" ? (
            <button
              onClick={() => {
                setOrderT1(true);
              }}
              style={{ fontSize: 20 }}
            >
              Adjust player picks
            </button>
          ) : cookies.player.charAt(0) == "r" ? (
            <button
              onClick={() => {
                setShowT1(true);
              }}
              style={{ fontSize: 20 }}
            >
              Add T1 times
            </button>
          ) : null}
        </div>
        <div className="grid nine">
          <p className="boss-1">{`Currently selected: ${selection.name}`}</p>
          {cookies.player.charAt(0) == "r" ? (
            <button
              className="boss-3"
              onClick={() => {
                socket.send(
                  JSON.stringify({
                    type: "switch",
                    phase: "finish",
                    id: props.id
                  })
                );
              }}
              disabled={identity.result != "progress"}
            >
              End Game
            </button>
          ) : (
            <button
              className="boss-3"
              onClick={() => {
                sendSelection(turn, selection);
              }}
              disabled={turn + "" != cookies.player.charAt(0)} //
            >
              Select
            </button>
          )}
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
            <button style={{ fontSize: 20 }} onClick={() => setOrderT2(true)}>
              Adjust player picks
            </button>
          ) : cookies.player.charAt(0) == "r" ? (
            <button style={{ fontSize: 20 }} onClick={() => setShowT2(true)}>
              Add T2 times
            </button>
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
              <Tooltip key={pick} title={"times"}>
                <p className={`boss boss-${pick + 2}`}>
                  {identity.timest2[pick]}
                </p>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <TimesModal
        times={identity.timest1}
        bosses={identity.bosses}
        playerNames={identity.playerst1}
        penalty={identity.penaltyt1}
        deaths={identity.deatht1}
        open={showT1Modal}
        close={closeT1Times}
        updateTimes={forwardTimes}
        team={1}
        updateStatus={updateStatusInfo}
      />
      <TimesModal
        times={identity.timest2}
        bosses={identity.bosses}
        playerNames={identity.playerst2}
        penalty={identity.penaltyt2}
        deaths={identity.deatht2}
        open={showT2Modal}
        close={closeT2Times}
        updateTimes={forwardTimes}
        team={2}
        updateStatus={updateStatusInfo}
      />
      <OrderModal
        team={1}
        teamName={identity.team1}
        open={showT1Order == true ? true : false}
        players={identity.playerst1}
        picks={identity.pickst1}
        progress={false}
        close={closeT1Order}
        reorder={changeTeamInfo}
      />
      <OrderModal
        team={2}
        teamName={identity.team2}
        open={showT2Order == true ? true : false}
        players={identity.playerst2}
        picks={identity.pickst2}
        progress={false}
        close={closeT2Order}
        reorder={changeTeamInfo}
      />
    </div>
  );
}
/*
  team 1 bans
*/