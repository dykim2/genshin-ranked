import { useState, useEffect, useContext, useRef, Fragment } from "react";
import { useCookies } from "react-cookie";
import "./css/Playing.css";
import "./css/Gameplay.css";
import CharacterContext from "../contexts/CharacterContext.js";
import Tooltip from "@mui/material/Tooltip";
import { PlayingContext } from "../contexts/PlayingContext.js";
import TimesModal from "./TimesModal.jsx";
import OrderModal from "./OrderModal.jsx";
import Countdown from "react-countdown";
import FilterModal from "./FilterModal.jsx";

import {Balancing} from "../../frontend/src/routes/balancing.tsx";
import {BossDisplay} from "../../frontend/src/routes/bosses.tsx";

import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details.ts";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details.ts";
import { displayBoss, displayCharacter } from "../components/BossComponent.tsx";
// import { BOSSES } from "@genshin-ranked/shared";
// 
const IMG_SIZE = 75;
const gameInfo = () => JSON.parse(sessionStorage.getItem("game")) || "yikes";
const charInfo = () => JSON.parse(sessionStorage.getItem("characters")) || [];
// const swapToBansPickIndex = 2; // can change in future games :eyes:

const MyTurn = (turnInfo, draftOver) => {
  if(draftOver){
    return null;
  }
  const [cookieInfo] = useCookies(["player"]);
  if ("" + turnInfo.turnInfo == cookieInfo.player.substring(0, 1)) {
    return <p style={{ color: "red", fontSize: 28 }}>your turn!</p>;
  } else if (
    (cookieInfo.player.substring(0, 1) == "1" ||
      cookieInfo.player.substring(0, 1) == "2") &&
    turnInfo.turnInfo > 0
  ) {
    return <p style={{ color: "red", fontSize: 28 }}>opponent's turn!</p>;
  } else {
    return (
      <p style={{ color: "red", fontSize: 28 }}>team {turnInfo.turnInfo}'s turn!</p>
    );
  }
}
const parseBoss = (data) => {
  // takes in a copy of local storage usestate
  // takes in a copy of data
  // returns the value to add to sessionStorage
  // find first boss
  const identity = JSON.parse(sessionStorage.getItem("game"));
  const bossList = JSON.parse(sessionStorage.getItem("bosses")); // note that very first one is -1
  // console.log(bossList)
  let nextArr = [0, 2, 1];
  let newBosses = [...identity.bosses];
  let long = false;
  for (let i = 0; i < identity.bosses.length; i++) {
    if (identity.bosses[i]._id == -1) {
      newBosses[i] = bossList[data.boss + 1];
      if(bossList[data.boss + 1].long){
        long = true;
      }
      break;
    }
  }
  let longArr = [...identity.longBoss];
  if(long){
    if(data.nextTeam < 0){
      longArr[1] = true;
    }
    else{
      longArr[nextArr[data.nextTeam] - 1] = true;
    }
  }
  let returnVal = "";
  if (data.nextTeam == -1) {
    alert(
      "Team 2 has selected " + bossList[data.boss + 1].boss + " for their boss!"
    );
    if(long){
      returnVal = {
        ...identity,
        result: "ban",
        bosses: newBosses,
        longBoss: longArr,
        turn: 1,
      };
    }
    else{
      returnVal = {
        ...identity,
        result: "ban",
        bosses: newBosses,
        turn: 1,
      };
    }
    
  } else {
    alert(
      "Team " +
        nextArr[data.nextTeam] +
        " has selected " +
        bossList[data.boss + 1].boss +
        " for their boss!"
    );
    if(long){
      returnVal = {
        ...identity,
        bosses: newBosses,
        longBoss: longArr,
        turn: data.nextTeam,
      };
    }
    else{
      returnVal = {
        ...identity,
        bosses: newBosses,
        turn: data.nextTeam,
      };
    }
  }
  // console.log("return");
  // console.log(returnVal);
  return returnVal;
};
const parseBan = (data) => {
  const charList = charInfo();
  const identity = JSON.parse(sessionStorage.getItem("game"));
  // check accordingly
  let newBans = [...identity.bans];
  let nextArr = [0, 2, 1];
  let index = -1;
  let noBan = {
    _id: -2,
    name: "No Ban",
    image: "coming soon",
    element: "dendro",
    icon: "https://thumbs4.imagebam.com/4b/77/61/METSLWN_t.png",
    chosen: false
  };
  let noBanChoice = false;
  for (let i = 0; i < identity.bans.length; i++) {
    if (identity.bans[i]._id == -1) {
      if(data.ban == -2){
        // no ban
        newBans[i] = noBan;
        noBanChoice = true;
      }
      else{
        // valid ban, find the character info and insert it
        for (let j = 0; j < charList.length; j++) {
          if (charList[j]._id == data.ban) {
            newBans[i] = charList[j];
            index = j;
            break;
          }
        }
      }
      break;
    }
  }
  if (data.nextTeam == -2) {
    if(noBanChoice){
      alert("Team 2 decided to not ban a character!");
    }
    else{
      alert("Team 2 has banned " + charList[index].name + "!");
    }
    
    return {
      ...identity,
      bans: newBans,
      result: "pick",
      turn: 1,
    };
  } else if (data.nextTeam == -1) {
    if (noBanChoice) {
      alert("Team 1 decided to not ban a character!");
    } else {
      alert("Team 1 has banned " + charList[index].name + "!");
    }
    return {
      ...identity,
      bans: newBans,
      result: "pick",
      turn: 2,
    };
  } else {
    if (noBanChoice) {
      alert("Team " + nextArr[data.nextTeam] + " decided to not ban a character!");
    } else {
      alert(
        "Team " +
          nextArr[data.nextTeam] +
          " has banned " +
          charList[index].name +
          "!"
      );
    }
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
  if (data.nextTeam == -1) {
    // picks are over
    console.log("sent from parsepick");
    returnInfo = {
      ...returnInfo,
      result: "play",
      turn: -1,
    };
    alert("Team 1 has selected " + charList[index].name + "!");
  } else if (data.nextTeam == -2) {
    // second phase of bans
    alert("Team 2 has selected " + charList[index].name + "!");
    returnInfo = {
      ...returnInfo,
      result: "ban",
      turn: 2,
    };
  } else {
    alert("Team " + data.team + " has selected " + charList[index].name + "!");
  }
  return returnInfo;
};
const parseTimes = (data) => {
  const identity = JSON.parse(sessionStorage.getItem("game"));
  if (data[0] == 1) {
    let newTimes = [...identity.timest1];
    newTimes[data[1]] = data[2];
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
const parseUpdate = (data) => {
  const identity = JSON.parse(sessionStorage.getItem("game"));
  // console.log(identity);
  // console.log("identity");
  let newIden = null;
  // arrange order
  let newOrder = [];
  for(let i = 0; i < identity.pickst1.length; i++){
    newOrder.push(identity[`pickst${data.team}`][data.order[i]])
  }
  console.log("new order");
  console.log(newOrder);
  if(data.team != 1 && data.team != 2){
    newIden = {...identity};
  }
  else{
    newIden = {
      ...identity,
      [`playerst${data.team}`]: data.playerNames,
      [`team${data.team}`]: data.teamName,
      [`pickst${data.team}`]: newOrder
    }
  }
  return newIden;
  // team information
}
const parseStatus = (data) => {
  const identity = JSON.parse(sessionStorage.getItem("game"));
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
  return newIden;
}

export default function Game(props) {
  // the actual meat of the game, including picks / bans / etc
  const [identity, setIdentity] = useState(gameInfo());
  const [characters, setCharacters] = useContext(CharacterContext);
  const [selection, setSelection] = useState({}); // what character they choose

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

  const [showTimer, setTimerVisible] = useState(false);
  const [chosenBosses, setChosenBosses] = useState(sessionStorage.getItem("selected_bosses"));
  const [chosenChars, setChosenChars] = useState(sessionStorage.getItem("selected_characters"));

  const [filtering, setFiltering] = useState(false);

  const [timer, setTimerValue] = useState(Date.now());
  const currentTime = useRef(0);
  currentTime.current = timer;

  const [bossFilterActive, setBossFilter] = useState(false);
  const [charFilterActive, setCharFilter] = useState(false);

  const characterRef = useRef();
  const bossRef = useRef();

  const updateTurn = (turn) => {
    setTurn(turn);
    sessionStorage.setItem("turn", turn);
  }

  // set an interval

  const updateTimer = (enabled = true, timerActive = false) => {
    enabled ? setTimerValue(Date.now()) : null;
    setTimerVisible(enabled);
    if(timerActive == false){
      // if it currently is the player's turn, trigger the selection send and end the timer
      // if nothing is selected or it is invalid, send a random pick
      // if it is ban stage, send a no ban (id -2) 
      // if it is not the player's turn, do nothing.
      // reset the timer 
      if(turn == cookies.player.charAt(0)){
        sendSelection(turn, selection, true) 
      }
    }
  }

  // https://rankedwebsocketapi.fly.dev/
  const updateIdentity = (info) => {
    // console.log(info);
    sessionStorage.removeItem('game');
    sessionStorage.setItem("game", JSON.stringify(info));
    setIdentity(info);
  };

  /*
  useEffect(() => {
    sessionStorage.setItem("game", JSON.stringify(identity));
  }, [identity])
  *
  */
  const forwardTimes = (boss, time, team) => {
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
    if (selection.id == -1) {
      console.log("none selected");
      return true;
    }
    switch (type) {
      case "boss":
        // check id and check name
        let bossInfo = JSON.stringify(identity.bosses);
        // console.log(bossInfo);
        if (
          bossInfo.includes(`"_id":${selection.id},`) ||
          bossInfo.includes(selection.name) ||
          checkBossStatus(selection.id)
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
          charInfo.includes(`\"_id\":${selection.id},`) ||
          charInfo.includes(selection.name) ||
          checkCharStatus(selection.id)
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

  const sendSelection = (teamNum, selection, timeout = false) => {
    let gameID = props.id;
    // console.log(selection);
    // use the selection variable
    // verify the same boss / pick is not already chosen
    console.log("selection")
    console.log(selection);
    // console.log(teamNum)
    // console.log(bosses);
    // set selection equal to the value hovered in session storage

    if (JSON.stringify(identity) == JSON.stringify({ connected: [0, 0, 0] })) {
      alert("identity error");
      return;
    }
    // boss, pick, etc
    let res = identity.result;
    let req = "";
    if(res.toLowerCase() == "boss"){
      selection.type = "boss";
      if(localStorage.getItem("boss") == null){
        selection = {};
      }
      else{
        selection.id = parseInt(localStorage.getItem("boss"));
      }
    }
    else if(res.toLowerCase() == "pick" || res.toLowerCase() == "ban"){
      selection.type = res.toLowerCase();
      if(localStorage.getItem("character") == null){
        selection = {};
      }
      else{
        selection.id = parseInt(localStorage.getItem("character"));
      }
    }
    let found = false;
    if (selection.type == "boss" && bosses[selection.id + 1].type == "legend" && identity.division.toLowerCase() != "premier") {
      if(timeout){
        alert("Time is up! Hovered boss is a local legend, which cannot be played in your division. A random boss will be selected.");
        found = true;
      }
      else{
        alert("You cannot pick legends in advanced or open division!");
        return; 
      }
    }
    if((selection.type == "boss" && res.toLowerCase() != "boss") || (selection.type == "character" && (res.toLowerCase() != "ban" && res.toLowerCase() != "pick"))){
      selection = {};
    }
    else if(selection.type == "boss" && identity.longBoss[teamNum - 1] && bosses[selection.id + 1].long == true && identity.division.toLowerCase() == "advanced"){
      alert("You cannot pick more than one long boss in advanced division!")
      return;
    }
    // implement check for long bosses / weeklies, all weeklies are long so i can just implement long boss check
    if(JSON.stringify(selection) == '{}'){
      alert("No selection was made! Random boss / pick or no ban is selected.")
      req = JSON.stringify({
        id: gameID,
        type: "add",
        changed: identity.result,
        data: {
          character: -3,
          boss: -3,
          team: teamNum,
        },
      });
      socket.send(req);
      updateTimer(false, true);
      return;
    }
    if (res.toLowerCase() == "waiting") {
      // check bosses, see if picked
      if (!checkSelection(selection, "boss")) {
        if(!timeout){
          alert("Time is up! Selected boss is invalid! A random boss will be selected.")
          found = true;
        }
        else{
          alert("Invalid pick! Please select a BOSS that has not been chosen yet!"); 
          return false;
        }
      }
      if(found){
        req = JSON.stringify({
          id: gameID,
          type: "add",
          changed: identity.result,
          data: {
            character: -3,
            boss: -3,
            team: teamNum,
          },
        });
      }
      else{
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
    } else {
      if (!checkSelection(selection, res)) {
        if(timeout){
          if(selection.type == "boss"){
            alert("Time is up! An invalid boss was selected, thereby a random boss will be chosen.")
          }
          else if(selection.type == "character"){
            if(identity.result == "ban"){
              alert("Time is up. An invalid character was selected, thereby no ban will be chosen.")
            }
            else{
              alert("Time is up. An invalid character was selected, thereby a random pick will be selected.")
            }
          }
          found = true;
        }
        else{
          if(selection.type == "boss"){
            alert("This boss has been picked already!");
          }
          else if(identity.result == "ban"){
            alert("This character is banned!");
          }
          else{
            alert("This character has already been picked!");
          }
          return false;
        }
      }
      if (found) {
        req = JSON.stringify({
          id: gameID,
          type: "add",
          changed: identity.result,
          data: {
            character: -3,
            boss: -3,
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
    }
    updateTimer(false, true);
    // console.log("sent from sendselectione");
    socket.send(req);
    return true;
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
  /**
   * Returns an object for styling information based on game progress.
   * @param {Number} timeDiff 
   * @param {Boolean} varChecked 
   * @returns an object containing display information
   */
  const parseTextColor = (timeDiff, varChecked = false) => {
    let color = "";
    let textColor = "white";
    if(timeDiff > 0.5 || (timeDiff > 0 && varChecked)){
      color = "red";
    }
    else if(timeDiff <= 0.5 && timeDiff >= -0.5 && !varChecked){ // 
      color = "yellow";
      textColor = "black";
    }
    else{
      color = "green";
    }
    
    return {
      color: textColor,
      marginTop: 10,
      textAlign: "center",
      backgroundColor: color,
    };
  };
  const parseStatusTooltip = (index, team) => {
    let penaltyString = "";
    let deathString = "";
    const penaltyMenu = ["Retry", "DNF", "Ref Error", "VAR", "VAR/Updated", "Forced RT", "Tech"]; // maybe add VAR/T1 wins, Var/T2 wins
    let deathMenu = [];
    switch(team){
      case 1: {
        deathMenu = [...identity.playerst1];
        for (let i = 0; i < identity.penaltyt1[index].length; i++) { // looks like [[false, false, false], [false, false, false]]
          if (identity.penaltyt1[index][i]) {
            penaltyString += penaltyMenu[i] + ", ";
          }
          if (i < identity.playerst1.length && identity.deatht1[index][i]) {
            deathString += deathMenu[i] + ", ";
          }
        }
        break;
      }
      case 2: {
        deathMenu = [...identity.playerst2];
        for (let i = 0; i < identity.penaltyt2[index].length; i++) {
          // looks like [[false, false, false], [false, false, false]]
          if (identity.penaltyt2[index][i]) {
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
        <p style={{color: 'red', fontSize: 20}}>
          <b>{`Penalties: `}</b>
          {`${penaltyString}`}
        </p>
        <p style={{color: 'blue', fontSize: 20}}>
          <b>{`Deaths: `}</b>
          {`${deathString}`}
        </p>
      </Fragment>
    );
  };
  useEffect(() => {
    // console.log("yes")
    const map = new Map();
    for(const someName in BOSS_DETAIL){
      // create a hashmap between index and some name
      map.set(BOSS_DETAIL[someName].index, someName)
    }
    bossRef.current = map;
    const newMap = new Map();
    for(const someName in CHARACTER_INFO){
      newMap.set(CHARACTER_INFO[someName].index, someName)
    }
    characterRef.current = newMap;
    if (sessionStorage.getItem("chosen_bosses") == null) {
      sessionStorage.setItem("chosen_bosses", JSON.stringify([]));
    }
    if (sessionStorage.getItem("chosen_picks") == null) {
      sessionStorage.setItem("chosen_picks", JSON.stringify([]));
    }
    if (
      localStorage.getItem("display_boss") != null &&
      localStorage.getItem("display_boss") != 0
    ) {
      setBossFilter(true);
    }
    [
      "character_elements",
      "character_rarity",
      "character_region",
      "character_weapons",
    ].forEach((type) => {
      if (
        localStorage.getItem(type) != null &&
        localStorage.getItem(type) != 0
      ) {
        setCharFilter(true);
      }
    });
    socket.addEventListener("open", function (event) {
      // this does not load more than once
    });
    if (typeof cookies.player == "undefined") {
      setCookie("player", "spectate");
    }
    if (socket.readyState == 1) {
      socket.send(
        JSON.stringify({
          type: "turn",
          id: props.id,
          getSelectionInfo: true,
        })
      );
      if (sessionStorage.getItem("game") == null) {
        console.log("socket open");
        socket.send(
          JSON.stringify({
            type: "get",
            id: props.id,
          })
        ); // should work if first connection is to here
      }
      if (sessionStorage.getItem("bosses") == null) {
        console.log("hihi");
        socket.send(
          JSON.stringify({
            type: "find",
            query: "boss",
          })
        );
      }
    }
    // Listen for messages
    socket.addEventListener("message", function (event) {
      console.log(JSON.parse(event.data));
      // console.log("^^^^");
      let data = JSON.parse(event.data);
      if (data.id != props.id) {
        return; // do nothing if game does not match
      }
      if (data.type === "query") {
        // since for some reason query is not equal to query in a switch statement
        if (data.boss) {
          sessionStorage.removeItem("bosses");
          setBosses(data.bossList);
          sessionStorage.setItem("bosses", JSON.stringify(data.bossList));
        } else {
          sessionStorage.removeItem("characters");
          setCharacters(data.characterList);
          sessionStorage.setItem("characters", data.characterList);
        }
      }
      if (data.message.toLowerCase() == "failure") {
        console.log(data);
        alert(data.error);
        return;
      }
      let res = null;
      switch (data.type) {
        case "create": {
          updateIdentity(data.game);
          break;
        }
        case "get": {
          updateIdentity(data.game);
          updateTurn(data.game.turn);
          break;
        }
        case "turn": {
          /*
          if(sessionStorage.getItem("turn") == data.turn && identity.result != "waiting" && identity.result != "progress"){
            // refresh the page when picking
            alert("If you refresh the page without picking, you will enter a random boss or pick and no ban.")
            socket.send(JSON.stringify({
              id: props._id,
              type: "add",
              changed: identity.result,
              data: {
                character: -3,
                boss: -3,
                team: data.turn,
              },
            }))
          }
          */
          updateTurn(data.turn);
          if (typeof data.bosses != "undefined") {
            sessionStorage.setItem(
              "chosen_bosses",
              JSON.stringify(data.bosses)
            );
            setChosenBosses(data.bosses);
          }
          if (typeof data.chars != "undefined") {
            setChosenChars(data.chars);
          }
          break;
        }
        case "boss": {
          updateTimer(true, true);
          res = parseBoss(data);
          let newBossArr = [];
          identity.bosses.forEach((boss) => {
            boss._id != -1 ? newBossArr.push(boss) : null;
          });
          newBossArr.push(data.boss);
          sessionStorage.setItem("chosen_bosses", JSON.stringify(newBossArr));
          setChosenBosses(newBossArr);
          break;
        }
        case "ban": {
          updateTimer(true, true);
          res = parseBan(data);
          let newCharArr = [];
          if (chosenChars != null) {
            newCharArr = [...chosenChars];
          } else {
            newCharArr = [];
          }
          newCharArr.push(data.ban);
          setChosenChars(newCharArr); // add id to list of chosen
          if (data.nextTeam == -2 || data.nextTeam == -1) {
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
          updateTimer(true, true);
          res = parsePick(data);
          let newCharArr = [];
          if (chosenChars != null) {
            newCharArr = [...chosenChars];
          } else {
            newCharArr = [];
          }
          newCharArr.push(data.pick);
          setChosenChars(newCharArr);
          if (data.nextTeam == -1) {
            socket.send(
              JSON.stringify({
                type: "switch",
                id: props.id,
                phase: "progress",
              })
            );
          } else if (data.nextTeam == -2) {
            socket.send(
              JSON.stringify({
                type: "switch",
                phase: "ban",
                id: props.id,
              })
            );
          }
          break;
        }
        case "times": {
          // info.data is in format of a three digit array: [team (1 or 2), boss number (0 to 6 or 8 depends on division), new time]
          res = parseTimes(data.time);
          break;
        }
        case "TeamUpdate": {
          res = parseUpdate(data);
          break;
        }
        case "players": {
          console.log("here")
          if(cookies.player.charAt(0) == 'R'){
            let info = "";
            for(let i = 0; i < data.playerStatus.length; i++){
              if(i < 2){
                info += `Player ${i+1} has joined: ${data.playerStatus[i]}\n`
              }
              else{
                info += `Two or more refs have joined: ${data.playerStatus[i]}\n`
              }
            }
            alert(info);
          }
          break;
        }
        case "status": {
          res = parseStatus(data);
          break;
        }
        case "phase": {
          if (data.newPhase == "boss") {
            updateTimer(true, true);
            alert("Draft starts now!");
          } else if (data.newPhase == "ban" || data.newPhase == "pick") {
            updateTimer(true, true);
          }
          res = {
            ...JSON.parse(sessionStorage.getItem("game")),
            result: data.newPhase,
          };
          break;
        }
      }
      if (res != null) {
        updateIdentity(res);
        updateTurn(res.turn);
      }
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
    /*
    let bossList = [];
    let bossIndexList = [];
    for (const [name, boss] of Object.entries(BOSS_DETAIL)) {
      bossList.push(name);
      bossIndexList.push(boss.index);
    }
    const bossMap = new Map();
    let charList = [];
    let charIndexList = [];
    for (const [name, char] of Object.entries(CHARACTER_INFO)) {
      charList.push(name);
      charIndexList.push(char.index);
    }
    const charMap = new Map();
    for (let i = 0; i < charList.length; i++) {
      if (i < bossList.length) {
        bossMap.set(bossIndexList[i], bossList[i]);
      }
      charMap.set(charIndexList[i], charList[i]);
    }
    // map the pair and save it in useref
    // bossRef.current = bossMap;
    // characterRef.current = characterRef;
    */
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

  const filterStyles = () => {
    if(charFilterActive || bossFilterActive){
      return{
        backgroundColor: "red"
      }
    }
    else{
      return{
        backgroundColor: "white"
      }
    }
  }

  const filterText = () => {
    if(charFilterActive || bossFilterActive){
      return "Filtering active!"
    }
    else{
      return "Filter bosses/characters"
    }
  }

  const filterPicks = (conditions) => {
    // console.log(conditions)
    const region = [
      "Select a region:",
      "Region: Any",
      "Region: Mondstadt",
      "Region: Liyue",
      "Region: Inazuma",
      "Region: Sumeru",
      "Region: Fontaine",
    ];
    const elements = [
      "Select an element:",
      "Element: Any",
      "Element: Pyro",
      "Element: Hydro",
      "Element: Electro",
      "Element: Cryo",
      "Element: Dendro",
      "Element: Geo",
      "Element: Anemo",
    ];
    const weapons = [
      "Select a weapon:",
      "Weapon: Any",
      "Weapon: Sword",
      "Weapon: Polearm",
      "Weapon: Claymore",
      "Weapon: Bow",
      "Weapon: Catalyst",
    ];
    const rarity = [
      "Select a rarity:",
      "Rarity: Any",
      "Rarity: 4-star",
      "Rarity: 5-star"
    ];
    const filters = [region, elements, weapons, rarity];
    const filterName = ["region", "elements", "weapons", "rarity"];
      // filter boss pick
      // for each region, if conditions[0] / conditions[1] is equal to regions[0] then set local storage to 0, otherwise if equal to regions[i] set local storage to i - 1
    for(let j = 0; j < region.length; j++){
      if(conditions[0] == region[j]){
        if(j <= 1){
          localStorage.setItem("display_boss", 0);
          setBossFilter(false);
        }
        else{
          localStorage.setItem("display_boss", j - 1);
          setBossFilter(true);
        }
        break;
      }
    };
    // filter character picks
    let filtering = false;
    for(let j = 0; j < filters.length; j++){
      for(let k = 0; k < filters[j].length; k++){
        if(conditions[j+1] == filters[j][k]){
          if(k <= 1){
            localStorage.setItem(`character_${filterName[j]}`, 0)
          }
          else{
            localStorage.setItem(`character_${filterName[j]}`, k - 1);
            filtering = true;
          }
          break;
        }
      }
    }
    setCharFilter(filtering);
  }
  /**
   * 
   * @param {*} info the array to display information with
   * @param {Boolean} boss whether the target array represents bosses or picks
   * @return an array displaying the corresponding picks
   */
  const displayFilter = (info, boss = true) => { 
    let newInfo = [];
    if(boss){
      if(localStorage.getItem("display_boss") == null || localStorage.getItem("display_boss") == 0){
        newInfo = [...info];
        // setBossFilter(false); // not filtering
      }
      else{
        const regions = ["any", "mondstadt", "liyue", "inazuma", "sumeru", "fontaine", "natlan"];
        info.forEach(bossChoice => {
          if(bossChoice.region.toLowerCase() == regions[localStorage.getItem("display_boss")]){
            newInfo.push(bossChoice);
          }
        })
        // setBossFilter(true);
      }
    }
    else{ 
      // loop, runs 4 times, checks similar to boss
      const region = [
        "Any",
        "Mondstadt",
        "Liyue",
        "Inazuma",
        "Sumeru",
        "Fontaine",
      ];
      const elements = [
        "Any",
        "Pyro",
        "Hydro",
        "Electro",
        "Cryo",
        "Dendro",
        "Geo",
        "Anemo",
      ];
      const weapons = [
        "Any",
        "Sword",
        "Polearm",
        "Claymore",
        "Bow",
        "Catalyst",
      ];
      const rarity = [
        0,
        4,
        5
      ];
      const filterName = [
        "character_region",
        "character_elements",
        "character_weapons",
        "character_rarity",
      ];
      const charInfoFilter = [
        "region",
        "element",
        "weapon",
        "rarity"
      ]
      const filter = [region, elements, weapons, rarity];
      info.forEach(charChoice => {
        let valid = true;
        for (let i = 0; i < filterName.length; i++) {
          // nested if statements
          // localstorage has index
          // check to see if said value is null or 0
          // if neither null or 0 check that the given character
          let res = localStorage.getItem(filterName[i]);
          if(res == null || res == 0){
            continue;
          }
          else{
            if(charInfoFilter[i] != "rarity" && charChoice[charInfoFilter[i]].toLowerCase() == filter[i][res].toLowerCase()){
              continue;
            }
            else if(charInfoFilter[i] == "rarity" && charChoice[charInfoFilter[i]] == filter[i][res]){
              continue;
              // rarity might not always be last
            }
            else{
              valid = false;
              break;
            }
          }
        }
        if(valid){
          newInfo.push(charChoice)
        }
      })
      
    }
    return newInfo;
  }
  // split the page into three parts, 25% / 50% / 25% (ish - grid takes cares of this)
  let bans = [0, 2, 5, 1, 3, 4];
  let timeOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div>
      {sessionStorage.getItem("game") == null ||
      sessionStorage.getItem("bosses") == null ||
      sessionStorage.getItem("characters") == null ||
      identity.connected == [0, 0, 0] ? (
        <p>Your page is currently loading!</p>
      ) : (
        <Fragment>
          <div className="container">
            <div className="grid one">
              {typeof identity.team1 == "undefined"
                ? "team 1 Selections"
                : identity.team1 + " picks"}
            </div>
            <div className="grid newgrid two">
              <p className="boss boss-1">
                {showInfo == "boss" ? "bosses:" : "characters:"}
              </p>
              <div className="boss boss-2">
                <MyTurn
                  turnInfo={turn == 1 ? 1 : 2}
                  draftOver={identity.result == "progress"}
                />
              </div>
              <p className="boss boss-3">
                {identity.result == "progress"
                  ? "draft complete!"
                  : identity.result != "waiting"
                  ? "select a " + identity.result.toLowerCase()
                  : "waiting to start"}
              </p>
              {identity.result != "progress" ? (
                showTimer ? (
                  <Countdown
                    className="boss boss-4"
                    date={timer + 30000}
                    onComplete={() => {
                      updateTimer(false, false);
                    }}
                  />
                ) : (
                  <p className="boss boss-4">timer inactive</p>
                )
              ) : null}
            </div>
            <div className="grid three">
              {typeof identity.team2 == "undefined"
                ? "team 2 Selections"
                : identity.team2 + " picks"}
            </div>
            <div className="grid four">
              {[0, 1, 2, 3, 4, 5].map((val) => {
                return (
                  <Fragment key={val}>
                    {val % 2 == 0 ? (
                      <p className={`pick pick-${2 * val + 1}`}>
                        {typeof identity.playerst1 == "undefined" ||
                        typeof identity.playerst1[val / 2] == "undefined"
                          ? "player " + (val + 1)
                          : identity.playerst1[val / 2]}
                      </p>
                    ) : null}
                    <div className={`pick pick-${2 * val + 2}`}>
                      {characterRef.current != undefined
                        ? displayCharacter(
                            characterRef.current.get(identity.pickst1[val]._id),
                            true
                          )
                        : null}
                    </div>
                  </Fragment>
                );
              })}
            </div>
            <div className="grid five">
              <div>
                {cookies.player.charAt(0) != "S" ? (
                  identity.result.toLowerCase() == "waiting" ||
                  identity.result.toLowerCase() == "boss" ? (
                    /* displayFilter(bosses, true).map((boss) => {
                        return boss._id > 0 ? (
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
                                    : typeof chosenBosses != "undefined" &&
                                      chosenBosses != null &&
                                      chosenBosses.includes(boss._id)
                                    ? "black"
                                    : "transparent",
                                margin: 5,
                              }}
                            />
                          </Tooltip>
                        ) : null;
                      })
                    */
                    <BossDisplay
                      id={props.id}
                      team={turn}
                      pickSelection={sendSelection}
                    />
                  ) : null
                ) : null}
              </div>
              <div>
                {cookies.player.charAt(0) != "S" ? (
                  identity.result.toLowerCase() == "ban" ||
                  identity.result.toLowerCase() == "pick" ? (
                    /* displayFilter(characters, false).map((char) => {
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
                                  : typeof chosenChars != "undefined" &&
                                    chosenChars != null && 
                                    chosenChars.includes(char._id)
                                  ? "black"
                                  : "transparent",
                              margin: 5,
                            }}
                          />
                        </Tooltip>
                      );
                    })
                  */
                    <Balancing
                      id={props.id}
                      team={turn}
                      phase={identity.result.toLowerCase()}
                      pickSelection={sendSelection}
                    />
                  ) : null
                ) : null}
              </div>
              <div>
                {identity.result.toLowerCase() == "progress" ||
                cookies.player.charAt(0).toLowerCase() == "s" ? (
                  <p>Thank you for drafting!</p>
                ) : null}
              </div>
            </div>
            <div className="grid seven">
              {[0, 1, 2, 3, 4, 5].map((val) => {
                return (
                  <Fragment key={val}>
                    {val % 2 == 0 ? (
                      <p className={`pick pick-${2 * val + 1}`}>
                        {typeof identity.playerst2 == "undefined" ||
                        typeof identity.playerst2[val / 2] == "undefined"
                          ? "player " + (val + 1)
                          : identity.playerst2[val / 2]}
                      </p>
                    ) : null}
                    <div className={`pick pick-${2 * val + 2}`}>
                      {characterRef.current != undefined
                        ? displayCharacter(
                            characterRef.current.get(identity.pickst2[val]._id),
                            true
                          )
                        : null}
                    </div>
                  </Fragment>
                );
              })}
            </div>
            <div className="grid newgrid eight">
              {cookies.player.charAt(0) == "1" ||
              cookies.player.charAt(0) == "R" ? (
                <button
                  onClick={() => {
                    setOrderT1(true);
                  }}
                  style={{ fontSize: 20 }}
                >
                  Adjust T1 picks
                </button>
              ) : null}
              {cookies.player.charAt(0) == "R" ? (
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
              {cookies.player.charAt(0) == "R" ? (
                <Fragment>
                  {identity.result != "waiting" ? (
                    <button
                      className="boss-4"
                      onClick={() => {
                        socket.send(
                          JSON.stringify({
                            type: "switch",
                            phase: "finish",
                            id: props.id,
                          })
                        );
                      }}
                      disabled={identity.result != "progress"}
                    >
                      End Game
                    </button>
                  ) : (
                    <button
                      className="boss-4"
                      onClick={() => {
                        socket.send(
                          JSON.stringify({
                            type: "switch",
                            phase: "boss",
                            id: props.id,
                          })
                        );
                      }}
                    >
                      Start Game
                    </button>
                  )}
                  <button
                    className="boss-3"
                    onClick={() => {
                      socket.send(
                        JSON.stringify({
                          type: "players",
                          id: props.id,
                        })
                      );
                    }}
                  >
                    Check players
                  </button>
                </Fragment>
              ) : null}
            </div>

            <div className="grid newgrid ten">
              {cookies.player.charAt(0) == "2" ||
              cookies.player.charAt(0) == "R" ? (
                <button
                  style={{ fontSize: 20 }}
                  onClick={() => setOrderT2(true)}
                >
                  Adjust T2 picks
                </button>
              ) : null}
              {cookies.player.charAt(0) == "R" ? (
                <button
                  style={{ fontSize: 20 }}
                  onClick={() => setShowT2(true)}
                >
                  Add T2 times
                </button>
              ) : null}
            </div>
            <div className="grid newgrid eleven">
              {/* <p className="boss boss-1">bans:</p> */ }
              {bans.slice(0, 3).map((ban) => {
                return (
                  <div className={`boss ban-${ban}`}>
                    {characterRef.current != undefined
                      ? displayCharacter(
                          characterRef.current.get(identity.bans[ban]._id),
                          false
                        )
                      : null}
                  </div>
                );
              })}
            </div>
            {}
            <div className="grid newgrid twelve">
              <div className="grid times-1">
                {/*
                  <p style={{ marginTop: 15 }}>bosses: </p>
                  <p style={{ marginTop: 36 }}>T1 times: </p>
                  <p style={{ marginTop: 12 }}>T2 times: </p>
                */}
              </div>
              {timeOrder.slice(0, -3).map((time) => {
                return (
                  <div className={`grid end times-${time + 1}`} key={time}>
                    {bossRef.current != undefined
                      ? displayBoss(
                          bossRef.current.get(identity.bosses[time]._id),
                          false
                        )
                      : null}
                    {/*
                      <Tooltip title={parseStatusTooltip(time, 1)} arrow>
                      <p
                        style={parseTextColor(
                          identity.timest1[time] - identity.timest2[time],
                          identity.penaltyt1[time][4]
                        )}
                      >
                        {identity.timest1[time].toFixed(2)}
                      </p>
                    </Tooltip>
                    <Tooltip title={parseStatusTooltip(time, 2)} arrow>
                      <p
                        style={parseTextColor(
                          identity.timest2[time] - identity.timest1[time],
                          identity.penaltyt2[time][4]
                        )}
                      >
                        {identity.timest2[time].toFixed(2)}
                      </p>
                    </Tooltip>
                    */}
                  </div>
                );
              })}
            </div>
            <div className="grid newgrid thirteen">
              {/*<p className="boss boss-1">bans:</p>*/}
              {bans.slice(3, 6).map((ban) => {
                // if needed add to return: typeof identity.bans == "undefined" || typeof identity.bans[ban] == "undefined" ? null :
                return (
                  <div className={`boss ban-${ban}`} key={ban}>
                    {characterRef.current != undefined
                      ? displayCharacter(
                          characterRef.current.get(identity.bans[ban]._id),
                          false
                        )
                      : null}
                  </div>
                );
              })}
            </div>
            <div className="grid fourteen">
              <p
                style={{
                  fontSize: 20,
                  fontFamily: "Roboto Mono",
                  alignItems: "center",
                }}
              >
                {`You are playing game ID`} <b>{`${props.id}! `}</b>
                Make sure everyone you are playing with joins this ID.
              </p>
            </div>

            <div className="grid newgrid sixteen">
              <button
                style={{ fontSize: 20 }}
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: "get",
                      phase: "ban",
                      id: props.id,
                    })
                  );
                }}
              >
                Refresh Game Info
              </button>
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
            progress={identity.result == "progress"}
            close={closeT1Order}
            reorder={changeTeamInfo}
          />
          <OrderModal
            team={2}
            teamName={identity.team2}
            open={showT2Order == true ? true : false}
            players={identity.playerst2}
            picks={identity.pickst2}
            progress={identity.result == "progress"}
            close={closeT2Order}
            reorder={changeTeamInfo}
          />
          <FilterModal
            open={filtering}
            close={() => {
              setFiltering(false);
            }}
            setOrder={filterPicks}
          />
        </Fragment>
      )}
    </div>
  );
}
/*
  team 1 bans
*/