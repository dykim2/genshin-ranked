import { useState, useEffect, useContext, useRef, Fragment, use } from "react";
import { useCookies } from "react-cookie";
import "./css/Playing.css";
import "./css/Gameplay.css";
import CharacterContext from "../contexts/CharacterContext.js";
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
import {getBossGifPath, getCharacterBanPath, getCharacterGifPath} from "../../shared/src/utils/imagePaths.ts"

import { Button, Typography } from "@mui/material";
import { GifPlay } from "../components/GifPlay.tsx";
// import { BOSSES } from "@genshin-ranked/shared";
// 
const IMG_SIZE = 75; // use eventually
const gameInfo = () => JSON.parse(sessionStorage.getItem("game")) || "yikes";
const charInfo = () => JSON.parse(sessionStorage.getItem("characters")) || [];
const TOTAL_TIME = 35500;
// const swapToBansPickIndex = 2; // can change in future games :eyes:

// to make sure people don't refresh website to stall, maybe i can re-implement the turn thing, where a random pick is made if server says its their turn and the init is ran

const MyTurn = (turnInfo, draftOver) => {
  if(draftOver == true){
    return null;
  }
  const [cookieInfo] = useCookies("player");
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
    if(long){
      if(identity.extrabans.length > 0){
        returnVal = {
          ...identity,
          result: "extraban",
          bosses: newBosses,
          longBoss: longArr,
          turn: identity.extrabanst1 > 0 ? 1 : 2,
        };
      }
      else{
        returnVal = {
          ...identity,
          result: "ban",
          bosses: newBosses,
          longBoss: longArr,
          turn: 1,
        };
      }
    }
    else{
      if(identity.extrabans.length > 0){
        returnVal = {
          ...identity,
          result: "extraban",
          bosses: newBosses,
          turn: identity.extrabanst1 > 0 ? 1 : 2, // 1 if short boss, 2 if long
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
    }
    
  } else {
    /*
    if(alerted){
      alert(
      "Team " +
        nextArr[data.nextTeam] +
        " has selected " +
        bossList[data.boss + 1].boss +
        " for their boss!"
    );
    }
    */
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
/**
 * 
 * @param {Object} data the data returned from the server
 * @param {boolean} extra whether this ban is an extra ban or not
 * @returns a copy of the game information, with the extra information added
 */
const parseBan = (data, extra = false) => {
  const charList = charInfo();
  const identity = JSON.parse(sessionStorage.getItem("game"));
  // check accordingly
  let newBans = [];
  if(extra){
    newBans = [...identity.extrabans];
    console.log(newBans);
  }
  else{
    newBans = [...identity.bans];
    console.log(newBans);
  }
  let index = -1;
  let noBan = {
    _id: -2,
    name: "No Ban",
    image: "coming soon",
    element: "physical",
    icon: "https://thumbs4.imagebam.com/4b/77/61/METSLWN_t.png",
    chosen: false
  };
  if(extra){ // add to extra bans over normal bans
    for (let i = 0; i < identity.extrabans.length; i++) {
      if (identity.extrabans[i]._id == -1) {
        if (data.extraban == -2) {
          // no ban
          newBans[i] = noBan;
        } else {
          // valid ban, find the character info and insert it
          for (let j = 0; j < charList.length; j++) {
            if (charList[j]._id == data.extraban) {
              newBans[i] = charList[j];
              index = j;
              break;
            }
          }
        }
        break;
      }
    }
  }
  else{
    for (let i = 0; i < identity.bans.length; i++) {
      if (identity.bans[i]._id == -1) {
        if (data.ban == -2) {
          // no ban
          newBans[i] = noBan;
        } else {
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
  }
  if (data.nextTeam == -2) {
    if(extra){
      return {
        ...identity,
        extrabans: newBans,
        result: "ban",
        turn: 1,
      };
    }
    else{
      return {
        ...identity,
        bans: newBans,
        result: "pick",
        turn: 1,
      };
    }
  } else if (data.nextTeam == -1) {
    // extra ban should never trigger here - second phase of bans -> picks
    return {
      ...identity,
      bans: newBans,
      result: "pick",
      turn: 2,
    };
  } else {
    if(extra){
      console.log("sent from parseban");
      return {
        ...identity,
        extrabans: newBans,
        turn: data.nextTeam,
      };
    }
    else{
      return {
        ...identity,
        bans: newBans,
        turn: data.nextTeam,
      };
    }
  }
};
const parsePick = (data) => {
  const charList = charInfo();
  const identity = JSON.parse(sessionStorage.getItem("game"));
  let returnInfo = "";
  let index = -1;
  // sererate extra bans here from the rest - need to implement to websocket
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
      result: "progress",
      turn: -1,
    };
  } else if (data.nextTeam == -2) {
    // second phase of bans
    returnInfo = {
      ...returnInfo,
      result: "ban",
      turn: 2,
    };
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
  const [identity, setIdentity] = useState(gameInfo);
  const [characters, setCharacters] = useContext(CharacterContext);
  const [selection, setSelection] = useState({}); // what character they choose
  // const [update, setUpdate] = useState(false);
  const [bosses, setBosses] = useState(
    JSON.parse(sessionStorage.getItem("bosses"))
  );
  const [turn, setTurn] = useState(identity.turn != undefined ? identity.turn : 1); // current turn
  const [cookies, setCookie] = useCookies(["player"]);
  const socket = useRef(null);

  const [showT1Modal, setShowT1] = useState(false);
  const [showT2Modal, setShowT2] = useState(false);

  const [showT1Order, setOrderT1] = useState(false);
  const [showT2Order, setOrderT2] = useState(false);

  const [showTimer, setTimerVisible] = useState(false);
  // const [chosenBosses, setChosenBosses] = useState(sessionStorage.getItem("selected_bosses"));
  // const [chosenChars, setChosenChars] = useState(sessionStorage.getItem("selected_characters"));

  const [timer, setTimerValue] = useState(Date.now());
  const currentTime = useRef(0);
  currentTime.current = timer;

  const [bossFilterActive, setBossFilter] = useState(false);
  const [charFilterActive, setCharFilter] = useState(false);

  const [alertLink, setLink] = useState("")
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertBan, setAlertBan] = useState(false)

  const characterRef = useRef();
  const bossRef = useRef();

  const intentionalClose = useRef(false);
  const selectedBosses = useRef([]);
  const selectedChars = useRef([]);

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
    console.log("identity");
    console.log(info)
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
    socket.current.send(
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
          return false;
        }
        break;
      case "ban":
      case "pick":
      case "extraban":
        let charInfo =
          JSON.stringify(identity.extrabans) +
          JSON.stringify(identity.bans) +
          JSON.stringify(identity.pickst1) +
          JSON.stringify(identity.pickst2);
        if (
          charInfo.includes(`\"_id\":${selection.id},`) ||
          charInfo.includes(selection.name) ||
          checkCharStatus(selection.id)
        ) {
          // pick is already chosen or banned
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  const sendSelection = (teamNum, selection, timeout = false) => {
    if(socket.current.readyState != 1){
      alert("Please refresh the page and try again!");
      return;
    }
    let gameID = props.id;
    // console.log(selection);
    // use the selection variable
    // verify the same boss / pick is not already chosen
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
    else if(res.toLowerCase() == "pick" || res.toLowerCase() == "ban" || res.toLowerCase() == "extraban"){
      selection.type = res.toLowerCase();
      if(localStorage.getItem("character") == null){
        selection = {};
      }
      else{
        selection.id = parseInt(localStorage.getItem("character"));
      }
    }
    if(identity.fearless){
      if (
        selection.id >= 0 &&
        selection.type == "boss" &&
        identity.fearlessBosses.includes(selection.id)
      ) {
        alert("This boss was picked in the previous match and may not be picked again!");
        return;
      }
    }
    let found = false;
    if (selection.type == "boss" && bosses[selection.id + 1].type == "legend" && identity.division.toLowerCase() != "premier") {
      if(timeout){
        alert("Time is up! Hovered boss is a local legend, which cannot be played in your division. A random boss will be selected.");
        found = true;
      }
      else{
        alert("You cannot pick legends in standard division!");
        return; 
      }
    }
    if((selection.type == "boss" && res.toLowerCase() != "boss") || (selection.type == "character" && (res.toLowerCase() != "ban" && res.toLowerCase() != "pick" && res.toLowerCase() != "extraban"))){
      console.log("invalid selection");
      selection = {};
    }
    else if(selection.type == "boss" && identity.longBoss[teamNum - 1] && bosses[selection.id + 1].long){
      console.log("ree")
      alert("You cannot pick more than one long boss in standard division (two in premier division)!")
      return;
    }
    console.log("test")
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
      socket.current.send(req);
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
          else if(identity.result == "ban" || identity.result == "extraban"){
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
    socket.current.send(req);
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
    socket.current.send(
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
    socket.current.send(
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
  const showSelectionAlert = (id, boss = false, ban = false) => {
    /*
    1. get character or boss from id
    2. get link by using character display name and append ".png"
    3. display the modal
    4. 2.5 seconds later, hide the modal
    */
    let path = "";
    let selection = "";
    if(boss){
      selection = bossRef.current.get(id);
      path = getBossGifPath(selection);
      selection = BOSS_DETAIL[selection].displayName
    }
    else{
      selection = characterRef.current.get(id);
      if(ban){
        path = getCharacterBanPath(selection);
        
      }
      else{
        path = getCharacterGifPath(selection);
      }
      selection = CHARACTER_INFO[selection].displayName
    }
    setLink(path);
    setAlertOpen(true);
    setTimeout(() => {
      setAlertOpen(false)
    }, 5000); // shows for 5 seconds, can be changed
  }
  /**
   * Updates the selected ref objects to highlight grayscale objects.
   * @param {number} option the choice of what to add to selected, default is 6 (all). 1 is bosses, 2 is extra bans, 3 is bans, 4 and 5 are team 1 and team 2 picks respective
   */
  const updateSelected = (option = 6) => {
    // option 1: update boss
    if (option == 1 || option == 6) {
      for (let i = 0; i < identity.bosses.length; i++) {
        if (
          identity.bosses[i]._id != -1 &&
          selectedBosses.current.indexOf(identity.bosses[i]._id) == -1
        ) {
          selectedBosses.current.push(identity.bosses[i]._id);
        }
      }
      if (identity.fearless) {
        for (let i = 0; i < identity.fearlessBosses.length; i++) {
          if (
            identity.fearlessBosses[i] != -1 &&
            selectedBosses.current.indexOf(identity.fearlessBosses[i]) == -1
          ) {
            selectedBosses.current.push(identity.fearlessBosses[i]);
          }
        }
      }
    }
    // option 2: update extra bans
    if (option == 2 || option == 6) {
      for (let i = 0; i < identity.extrabans.length; i++) {
        if (
          identity.extrabans[i]._id > -1 && // could be higher than -1
          selectedChars.current.indexOf(identity.extrabans[i]._id) == -1
        ) {
          selectedChars.current.push(identity.extrabans[i]._id);
        }
      }
    }
    // option 3: update bans
    if (option == 3 || option == 6) {
      for (let i = 0; i < identity.bans.length; i++) {
        if (
          identity.bans[i]._id > -1 && // could be higher than -1
          selectedChars.current.indexOf(identity.bans[i]._id) == -1
        ) {
          selectedChars.current.push(identity.bans[i]._id);
        }
      }
    }
    // option 4: update team 1 picks
    // option 5: update team 2 picks
    if (option == 4 || option == 5 || option == 6) {
      for (let i = 0; i < identity.pickst1.length; i++) {
        // both picks arrays are the same length
        if (
          identity.pickst1[i]._id != -1 &&
          selectedChars.current.indexOf(identity.pickst1[i]._id) == -1 &&
          option != 5
        ) {
          selectedChars.current.push(identity.pickst1[i]._id);
        }
        // TODO: simplify this so both if statements are combined in a for loop
        if (
          identity.pickst2[i]._id != -1 &&
          selectedChars.current.indexOf(identity.pickst2[i]._id) == -1 &&
          option != 4
        ) {
          selectedChars.current.push(identity.pickst2[i]._id);
        }
      }
    }
    // option 6: update everything
  }

  const updateSelectedDirect = (id, option) => {
    // option 1: update boss
    if(option == 1){
      selectedBosses.current.push(id);
    }
    else if(option >= 2 && option <= 5){
      selectedChars.current.push(id);
    }
  }
  const compare = (one, two) => {
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
  };
  useEffect(() => {
    // console.log("yes")
    // adds selected characters and bosses to the ref objects
    updateSelected(6);
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
    if ( // this
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
    const createSocket = () => {
      let socket = new WebSocket("wss://rankedwebsocketapi.fly.dev"); // wss://rankedwebsocketapi.fly.dev
      socket.addEventListener("open", function (event) {
        // this does not load more than once
        // build a reconnection algorithm here
        console.log("socket opened here");
        if (window.timer) {
          clearInterval(window.timer);
          window.timer = 0;
        }
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
          socket.send(
            JSON.stringify({
              type: "get",
              id: props.id,
            })
          ); // should work if first connection is to here
        }
        if (sessionStorage.getItem("bosses") == null) {
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
        } // even if i go back, props.id does not exist, so this will return true and thereby nothing will happen
        if (data.type === "query") {
          // since for some reason query is not equal to query in a switch statement
          if (data.boss) {
            sessionStorage.removeItem("bosses");
            setBosses(data.bossList);
            sessionStorage.setItem("bosses", JSON.stringify(data.bossList));
          } else {
            newList = [];
            data.characterList.map((char) => {
              if (char._id >= 0) {
                newList.push(char);
              }
            });
            newList.sort(compare);
            sessionStorage.removeItem("characters");
            // sort by _id - eventually
            setCharacters(newList);
            sessionStorage.setItem("characters", newList);
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
            updateSelected(6);
            break;
          }
          case "turn": {
            updateTurn(data.turn);
            /*
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
          */
            break;
          }
          case "boss": {
            updateTimer(true, true);
            res = parseBoss(data);
            updateSelectedDirect(data.boss, 1);
            showSelectionAlert(data.boss, true, false);
            break;
          }
          // should only execute if extra ban setting is enabled
          case "extraban":
          case "ban": {
            updateTimer(true, true);
            res = parseBan(data, data.type == "extraban");
            if(data.type == "extraban"){
              updateSelectedDirect(data.extraban, 2);
              showSelectionAlert(data.extraban, false, true);
            }
            else{
              updateSelectedDirect(data.ban, 2);
              showSelectionAlert(data.ban, false, true);
            }
            break;
          }
          case "pick": {
            updateTimer(true, true);
            res = parsePick(data);
            updateSelectedDirect(data.pick, 3);
            showSelectionAlert(data.pick, false, false);
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
            if (cookies.player.charAt(0) == "R") {
              let info = "";
              for (let i = 0; i < data.playerStatus.length; i++) {
                if (i < 2) {
                  info += `Player ${i + 1} has joined: ${
                    data.playerStatus[i]
                  }\n`;
                } else {
                  info += `Two or more refs have joined: ${data.playerStatus[i]}\n`;
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
              if (cookies.player.charAt(0).toLowerCase() != "s") {
                alert("Draft starts now!");
              }
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
        if (!window.timer) {
          window.timer = setInterval(() => {
            socket = createSocket();
          }, 5000);
        }
        socket.close();
      });
      socket.addEventListener("error", function (event) {
        console.log("An error occured");
        console.log(event.data);
        socket.close();
      });
      // console.log("socket build")
      return socket;
    }
    socket.current = createSocket()
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
 
  /**
   * 
   * @param {*} info the array to display information with
   * @param {Boolean} boss whether the target array represents bosses or picks
   * @return an array displaying the corresponding picks
   */
  /*
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
    */
  // split the page into three parts, 25% / 50% / 25% (ish - grid takes cares of this)
  let bans = [0, 2, 5, 1, 3, 4];
  let timeOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const limit = identity.bosses == undefined ? 0 : identity.bosses.length;
  let extraBanCounter = 0;
  let extraBanOrder = [[], []];
  if(identity.extrabans.length > 0){
    // creates extra ban order based on the number of extra bans of each team
    // alternates 1 - 2 - 1 - 2 - 1 - 2 until a team runs out of extra bans, which then the rest are the other team's
    for(let i = 0; i < Math.max(identity.extrabanst1, identity.extrabanst2); i++){
      if(i < identity.extrabanst1){
        extraBanOrder[0].push(extraBanCounter);
        extraBanCounter++;
      }
      if(i < identity.extrabanst2){
        extraBanOrder[1].push(extraBanCounter);
        extraBanCounter++;
      }
    }
  }
  return (
    <div>
      {sessionStorage.getItem("game") == null ||
      sessionStorage.getItem("bosses") == null ||
      sessionStorage.getItem("characters") == null ||
      identity.connected == [0, 0, 0] ? (
        <p>your page is currently loading!</p>
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
                {identity.fearless &&
                (identity.result.toLowerCase() == "waiting" ||
                  identity.result.toLowerCase() == "boss")
                  ? "fearless bosses active!"
                  : null}
              </p>
              <div className="boss boss-2">
                {/* console.log(identity.result == "progress" || identity.result == "finish") */}
                <MyTurn
                  turnInfo={turn == 1 ? 1 : 2}
                  draftOver={
                    identity.result == "progress" || identity.result == "finish"
                  }
                />
              </div>
              <p className="boss boss-3">
                {identity.result == "progress" || identity.result == "finish"
                  ? "draft complete!"
                  : identity.result != "waiting"
                  ? "select a " + identity.result.toLowerCase()
                  : "waiting to start"}
              </p>
              {identity.result != "progress" ? (
                showTimer ? (
                  <Countdown
                    className="boss boss-4"
                    date={timer + TOTAL_TIME}
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
                      {/* characterRef.current != undefined
                        ? console.log(
                            characterRef.current.get(identity.pickst1[val]._id)
                          )
                        : null */}
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
            <div
              ref={(el) => {
                // borrowed code
                if (!el) return;
                let prevValue = JSON.stringify(el.getBoundingClientRect());
                const start = Date.now();
                const handle = setInterval(() => {
                  let nextValue = JSON.stringify(el.getBoundingClientRect());
                  if (nextValue === prevValue) {
                    clearInterval(handle);
                    /*
                    console.log(
                      `width stopped changing in ${
                        Date.now() - start
                      }ms. final width:`,
                      el.getBoundingClientRect().width
                    );
                    */
                    localStorage.setItem("x", el.getBoundingClientRect().x);
                  } else {
                    prevValue = nextValue;
                  }
                }, 100);
              }}
              className="grid five"
              style={
                identity.result.toLowerCase() == "progress" ||
                cookies.player.charAt(0).toLowerCase() == "s"
                  ? { minWidth: 1080 }
                  : null
              }
            >
              <div>
                {cookies.player.charAt(0) != "S" ? (
                  identity.result.toLowerCase() == "waiting" ||
                  identity.result.toLowerCase() == "boss" ? (
                    <BossDisplay
                      id={props.id}
                      team={turn}
                      pickSelection={sendSelection}
                      inGame={true}
                      selections={selectedBosses.current}
                    />
                  ) : identity.result.toLowerCase() == "ban" ||
                    identity.result.toLowerCase() == "pick" || 
                    identity.result.toLowerCase() == "extraban" ? (
                    <Balancing
                      team={turn}
                      phase={identity.result.toLowerCase()}
                      pickSelection={sendSelection}
                      inGame={true}
                      bonusInfo={[""]}
                      selections={selectedChars.current}
                    />
                  ) : null
                ) : null}
              </div>
              <div>
                {identity.result.toLowerCase() == "progress" ||
                cookies.player.charAt(0).toLowerCase() == "s" ? (
                  <p>thank you for drafting!</p>
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
                      {/* characterRef.current != undefined
                        ? console.log(
                            characterRef.current.get(identity.pickst1[val]._id)
                          )
                        : null */}
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
                <Button
                  onClick={() => {
                    setOrderT1(true);
                  }}
                  sx={{
                    backgroundColor: "black",
                    color: "yellow",
                  }}
                >
                  <Typography textTransform="none">adjust t1 picks</Typography>
                </Button>
              ) : null}
              {/* cookies.player.charAt(0) == "R" ? (
                <Button
                  onClick={() => {
                    setShowT1(true);
                  }}
                  sx={{
                    backgroundColor: "black",
                    color: "yellow",
                  }}
                >
                  <Typography textTransform="none">add t1 times</Typography>
                </Button>
              ) : null */}
              {/* commented out as not needed, may be used in future */}
            </div>
            <div className="grid nine">
              {cookies.player.charAt(0) == "R" ? (
                <Fragment>
                  {identity.result != "waiting" ? (
                    <Button
                      className="boss-4"
                      sx={{ backgroundColor: "black", color: "yellow" }}
                      onClick={() => {
                        socket.current.send(
                          JSON.stringify({
                            type: "switch",
                            phase: "finish",
                            id: props.id,
                          })
                        );
                      }}
                      disabled={identity.result != "progress"}
                    >
                      <Typography textTransform="none">end game</Typography>
                    </Button>
                  ) : (
                    <Button
                      className="boss-4"
                      sx={{ backgroundColor: "black", color: "yellow" }}
                      onClick={() => {
                        socket.current.send(
                          JSON.stringify({
                            type: "switch",
                            phase: "boss",
                            id: props.id,
                          })
                        );
                      }}
                    >
                      <Typography textTransform="none">start game</Typography>
                    </Button>
                  )}
                  <Button
                    className="boss-3"
                    onClick={() => {
                      socket.current.send(
                        JSON.stringify({
                          type: "players",
                          id: props.id,
                        })
                      );
                    }}
                    sx={{
                      backgroundColor: "black",
                      color: "yellow",
                    }}
                  >
                    <Typography textTransform="none">check players</Typography>
                  </Button>
                </Fragment>
              ) : null}
            </div>
            <div className="grid newgrid ten">
              {cookies.player.charAt(0) == "2" ||
              cookies.player.charAt(0) == "R" ? (
                <Button
                  sx={{
                    backgroundColor: "black",
                    color: "yellow",
                  }}
                  onClick={() => setOrderT2(true)}
                >
                  <Typography textTransform="none">adjust t2 picks</Typography>
                </Button>
              ) : null}
              {/* cookies.player.charAt(0) == "R" ? (
                <Button
                  onClick={() => {
                    setShowT2(true);
                  }}
                  sx={{
                    fontSize: 20,
                    backgroundColor: "black",
                    color: "yellow",
                  }}
                >
                  <Typography textTransform="none">add t2 times</Typography>
                </Button>
              ) : null }
              {/* commented out as not needed, may be used in future */}
            </div>
            <div className="grid newgrid eleven">
              {/* <p className="boss boss-1">bans:</p> */}
              {bans.slice(0, 3).map((ban) => {
                return (
                  <div key={ban} className={`boss ban-${ban}`}>
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
            <div className="grid newgrid twelve">
              {timeOrder.slice(0, limit).map((time) => {
                return (
                  <div className={`grid center times-${time + 1}`} key={time}>
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
            <div className="grid fourteen">extra bans (team 1)</div>
            <div className="grid sixteen">extra bans (team 2)</div>
            <div className="grid newgrid seventeen">
              {identity.extrabanst1 > 0
                ? extraBanOrder[0].map((ban, index) => {
                    return (
                      <div className={`boss ban-${index + 1}`} key={index}>
                        {characterRef.current != undefined
                          ? displayCharacter(
                              characterRef.current.get(
                                identity.extrabans[ban]._id
                              ),
                              false
                            )
                          : null}
                      </div>
                    );
                  })
                : null}
            </div>
            <div className="grid newgrid nineteen">
              {/* extra bans */}
              {identity.extrabanst2 > 0
                ? extraBanOrder[1].map((ban, index) => {
                    return (
                      <div className={`boss ban-${index + 1}`} key={index}>
                        {characterRef.current != undefined
                          ? displayCharacter(
                              characterRef.current.get(
                                identity.extrabans[ban]._id
                              ),
                              false
                            )
                          : null}
                      </div>
                    );
                  })
                : null}
            </div>
            <div className="grid newgrid twenty">
              <p
                style={{
                  fontSize: 20,
                  fontFamily: "Roboto Mono",
                  alignItems: "center",
                }}
              >
                {`you are playing game id`} <b>{`${props.id}! `}</b>
                make sure everyone you are playing with joins this id.
              </p>
            </div>
            <div className="grid newgrid twentytwo">
              <Button
                style={{ backgroundColor: "black", color: "yellow" }}
                onClick={() => {
                  socket.current.send(
                    JSON.stringify({
                      type: "get",
                      phase: "ban",
                      id: props.id,
                    })
                  );
                }}
              >
                <Typography textTransform="none">refresh game info</Typography>
              </Button>
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
          <GifPlay
            link={alertLink}
            isOpen={alertOpen}
            onClose={() => {}}
            ban={alertBan}
          />
        </Fragment>
      )}
    </div>
  );
}