import { useState, useEffect, useContext, useRef, Fragment } from "react";
import { useCookies } from "react-cookie";
import "./css/Playing.css";
import "./css/Gameplay.css";
import CharacterContext from "../contexts/CharacterContext.js";
import OrderModal from "./OrderModal.jsx";
import Countdown from "react-countdown";

import {Balancing} from "../../frontend/src/routes/balancing.tsx";
import {BossDisplay} from "../../frontend/src/routes/bosses.tsx";

import { BOSS_DETAIL } from "@genshin-ranked/shared/src/types/bosses/details.ts";
import { CHARACTER_INFO } from "@genshin-ranked/shared/src/types/characters/details.ts"; 
import { displayBoss, displayCharacter } from "../components/BossComponent.tsx";
import {getBossGifPath, getCharacterBanPath, getCharacterGifPath} from "../../shared/src/utils/imagePaths.ts"

import { Box, Button, Typography, Grid, Paper, Stack } from "@mui/material";
import { GifPlay } from "../components/GifPlay.tsx";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {restrictToHorizontalAxis, restrictToVerticalAxis} from "@dnd-kit/modifiers";
import ChangeModal from "./ChangeModal.tsx";
// import { BOSSES } from "@genshin-ranked/shared";
// 
const IMG_SIZE = 75; // use eventually
const gameInfo = () => JSON.parse(sessionStorage.getItem("game")) || "yikes";
const charInfo = () => JSON.parse(sessionStorage.getItem("characters")) || [];
const TIMER = 35500;

// const swapToBansPickIndex = 2; // can change in future games :eyes:

// to make sure people don't refresh website to stall, maybe i can re-implement the turn thing, where a random pick is made if server says its their turn and the init is ran

const MyTurn = (turnInfo, draftOver) => {
  if(draftOver){
    return null;
  }
  if(turnInfo.turnInfo == 3){
    return (
      <p style={{ color: "white", fontSize: 28 }}> draft paused</p>
    )
  }
  const [cookieInfo] = useCookies("player");
  if ("" + turnInfo.turnInfo == cookieInfo.player.substring(0, 1)) {
    return <p style={{ color: "green", fontSize: 28 }}>your turn!</p>;
  } else if (
    (cookieInfo.player.substring(0, 1) == "1" ||
      cookieInfo.player.substring(0, 1) == "2") &&
    turnInfo.turnInfo > 0
  ) {
    return <p style={{ color: "red", fontSize: 28 }}>opponent's turn!</p>;
  } else {
    return (
      <p style={{ color: "white", fontSize: 28 }}>team {turnInfo.turnInfo}'s turn!</p>
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
  // check boss exists

  let nextArr = [0, 2, 1];
  let newBosses = [...identity.bosses];
  let oldIds = identity.bosses.map(boss => boss._id);
  if(oldIds.includes(data.boss)){
    console.log("duplicate boss located");
  }
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

const Game = (props) => {
  // the actual meat of the game, including picks / bans / etc
  const [identity, setIdentity] = useState(gameInfo);
  const [characters, setCharacters] = useContext(CharacterContext);
  // const [selection, setSelection] = useState({}); // what character they choose
  // const [update, setUpdate] = useState(false);
  const [bosses, setBosses] = useState(
    JSON.parse(sessionStorage.getItem("bosses"))
  );
  const [turn, setTurn] = useState(
    identity.turn != undefined ? identity.turn : 1
  ); // current turn
  const [cookies, setCookie] = useCookies(["player"]);
  const socket = useRef(props.socket);

  const [banInfo, setBanInfo] = useState([false, 3, 6]);
  // in order: 8 bans (3 + 1), ban split 1, ban split 2

  // const [showT1Modal, setShowT1] = useState(false);
  // const [showT2Modal, setShowT2] = useState(false);

  const [canPause, setPause] = useState(true); // true or false

  // const [showT1Order, setOrderT1] = useState(false);
  // const [showT2Order, setOrderT2] = useState(false);

  const [showChanges, setShowChanges] = useState(false);
  const [changeInfo, setChangeInfo] = useState(["", "", 1, -1]);
  // in order: type, name, team (1 or 2, 0 if boss), id

  const [showTimer, setTimerVisible] = useState(false);
  // const [chosenBosses, setChosenBosses] = useState(sessionStorage.getItem("selected_bosses"));
  // const [chosenChars, setChosenChars] = useState(sessionStorage.getItem("selected_characters"));

  const [timer, setTimerValue] = useState(Date.now());
  const currentTime = useRef(0);

  // const [bossFilterActive, setBossFilter] = useState(false);
  // const [charFilterActive, setCharFilter] = useState(false);

  const [alertLink, setLink] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  // const [alertBan, setAlertBan] = useState(false);

  const countdownRef = useRef(null);

  const characterRef = useRef();
  const bossRef = useRef();
  const dndRef = useRef("boss");

  const selectedBosses = useRef([]);
  const selectedChars = useRef([]);

  const [extraInfo, setExtraInfo] = useState(""); // info to send to the balancing / bosses text
  const [totalTime, setTotalTime] = useState(0); // total time for timer
  const [active, setActive] = useState(true);

  useEffect(() => {
    // adds selected characters and bosses to the ref objects
    localStorage.setItem("timer", "false");
    if(sessionStorage.getItem("totalbans") == "2+1"){
      if (banInfo[0]) {
        console.log("change ban info");
        setBanInfo([false, 3, 6]);
      }
    }
    else{
      if (!banInfo[0]) {
        console.log("reset ban info");
        setBanInfo([true, 4, 8]);
      }
    }
    updateSelected(6);
    const map = new Map();
    for (const someName in BOSS_DETAIL) {
      // create a hashmap between index and some name
      map.set(BOSS_DETAIL[someName].index, someName);
    }
    bossRef.current = map;
    const newMap = new Map();
    for (const someName in CHARACTER_INFO) {
      newMap.set(CHARACTER_INFO[someName].index, someName);
    }
    characterRef.current = newMap;
    if (sessionStorage.getItem("chosen_bosses") == null) {
      sessionStorage.setItem("chosen_bosses", JSON.stringify([]));
    }
    if (sessionStorage.getItem("chosen_picks") == null) {
      sessionStorage.setItem("chosen_picks", JSON.stringify([]));
    }
    if (
      // this
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
        // here
      }
    });
    const handleOpen = () => {
      console.log("socket opened here");
      setupSocket();
    };
    socket.current.addEventListener("open", handleOpen);
    const handleMessage = (event) => {
      // console.log(JSON.parse(event.data));
      handleSocketMessage(event);
    };
    if (typeof cookies.player == "undefined") {
      setCookie("player", "spectate");
    }
    // Listen for messages
    socket.current.addEventListener("message", handleMessage);
    const handleClose = () => {};
    socket.current.addEventListener("close", handleClose);
    const handleError = (event) => {
      console.log("An error occured");
      console.log(event.data);
      socket.current.close();
    };
    socket.current.addEventListener("error", handleError);
    return () => {
      if (socket.current.readyState == WebSocket.OPEN) {
        // socket.current.close();
        // close event listeners?
        socket.current.removeEventListener("open", handleOpen);
        socket.current.removeEventListener("message", handleMessage);
        socket.current.removeEventListener("close", handleClose);
        socket.current.removeEventListener("error", handleError);
      }
    };
  }, []);

  const updateTurn = (turn) => {
    setTurn(turn);
    sessionStorage.setItem("turn", turn);
  };
  currentTime.current = timer;
  // set an interval
  /**
   * updates timer information.
   * @param {boolean} enabled whether the timer is meant to be enabled or not
   * @param {boolean} resetTime whether to reset the timer or not
   */
  const updateTimer = (enabled = true, resetTime = true) => {
    if (totalTime != TIMER && resetTime) {
      // reset timer after refresh page
      setTotalTime(TIMER);
    }
    if (enabled) {
      setTimerValue(Date.now());
      setActive(true);
    } else {
      setActive(false); // this minor change should prevent button from being pressed right after processing
      // just need to check hover works
    }
    setTimerVisible(enabled);
    localStorage.setItem("timer", enabled + "");
  };

  const updateIdentity = (info) => {
    console.log(info);
    console.log("identity");
    // console.log(info);
    sessionStorage.removeItem("game");
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
          bossInfo.includes(`\"_id\":${selection.id},`) ||
          bossInfo.includes(selection.name)
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
          charInfo.includes(selection.name)
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

  const sendHover = (teamNum, selection) => {
    // teamNum is 1 / 2 depending on team 1 or 2
    // selection is the choice made
    // both are numbers
    if (socket.current == null || socket.current.readyState != 1) {
      alert("Please refresh the page!");
      return;
    }
    // notably, does NOT check if the pick is valid
    if (teamNum == -1) {
      return;
    }
    let req = JSON.stringify({
      id: props.id,
      type: "hover",
      team: teamNum,
      hovered: selection,
    });
    socket.current.send(req);
  };

  const sendChangePick = () => {
    // probably show a modal or sorts like what has been shown before
  };

  const sendSelection = (teamNum, selection, timeout = false) => {
    // should no longer be run on timer end
    // instead server will handle it
    // assumes coket is open which should always be the case
    if (socket.current.readyState != 1) {
      alert("Please refresh the page and try again!");
      return;
    }
    if (!canPause) {
      alert("The game is currently paused!");
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
    if (res.toLowerCase() == "boss") {
      selection.type = "boss";
      if (localStorage.getItem("boss") == null) {
        selection = {};
      } else {
        selection.id = parseInt(localStorage.getItem("boss"));
      }
    } else if (
      res.toLowerCase() == "pick" ||
      res.toLowerCase() == "ban" ||
      res.toLowerCase() == "extraban"
    ) {
      selection.type = res.toLowerCase();
      if (localStorage.getItem("character") == null) {
        selection = {};
      } else {
        selection.id = parseInt(localStorage.getItem("character"));
      }
    }
    if (identity.fearless) {
      if (
        selection.id >= 0 &&
        selection.type == "boss" &&
        identity.fearlessBosses.includes(selection.id)
      ) {
        setExtraInfo([selection.id, teamNum]);
        return;
      }
    }
    let found = false;
    if (
      selection.type == "boss" &&
      bosses[selection.id + 1].type == "legend" &&
      identity.division != "premier"
    ) {
      if (timeout) {
        setExtraInfo(
          "Time is up! Local legends cannot be played in your division. A random boss will be selected."
        );
        found = true;
      } else {
        setExtraInfo("You cannot pick legends in standard division!");
        return;
      }
    }
    if (
      (selection.type == "boss" && res.toLowerCase() != "boss") ||
      (selection.type == "character" &&
        res.toLowerCase() != "ban" &&
        res.toLowerCase() != "pick" &&
        res.toLowerCase() != "extraban")
    ) {
      console.log("invalid selection");
      setExtraInfo("selection invalid!");
      selection = {};
    } else if (
      selection.type == "boss" &&
      identity.longBoss[teamNum - 1] &&
      bosses[selection.id + 1].long
    ) {
      console.log("ree");
      setExtraInfo(
        "You cannot pick more than one long boss in standard division (two in premier division)!"
      );
      if (timeout) {
        found = true;
      } else {
        return;
      }
    }
    // implement check for long bosses / weeklies, all weeklies are long so i can just implement long boss check
    if (JSON.stringify(selection) == "{}") {
      setExtraInfo(
        "No selection was made! Random boss / pick or no ban is selected."
      );
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
      found = true;
    } else if (res.toLowerCase() == "waiting") {
      // should only trigger on first pick
      // check bosses, see if picked
      if (!checkSelection(selection, "boss")) {
        if (!timeout) {
          setExtraInfo(
            "Time is up! Selected boss is invalid! A random boss will be selected."
          );
          found = true;
        } else {
          setExtraInfo(
            "Invalid pick! Please select a BOSS that has not been chosen yet!"
          );
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
    } else {
      if (!checkSelection(selection, res)) {
        if (timeout) {
          if (selection.type == "boss") {
            setExtraInfo(
              "Time is up! An invalid boss was selected, thereby a random boss will be chosen."
            );
          } else if (selection.type == "character") {
            if (identity.result == "ban") {
              setExtraInfo(
                "Time is up. An invalid character was selected, thereby no ban will be chosen."
              );
              // remove these alerts, all of them, add extra text to show that it was random
            } else {
              setExtraInfo(
                "Time is up. An invalid character was selected, thereby a random pick will be selected."
              );
            }
          }
          found = true;
        } else {
          if (selection.type == "boss") {
            setExtraInfo("This boss has been picked already!");
          } else if (
            identity.result == "ban" ||
            identity.result == "extraban"
          ) {
            //during ban phase, shows this, need to fix probs
            setExtraInfo("This character is banned!");
          } else {
            setExtraInfo("This character has already been picked!");
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
    console.log("request");
    console.log(req);
    // console.log("sent from sendselectione");
    if (found == false) {
      setExtraInfo(""); // reset on success
    } else {
      // 10 second timeout, then clear
      setTimeout(() => {
        setExtraInfo("");
      }, 15000);
    }
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
  /*
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
    console.log("gjherr");
    return;
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
  */
  const updateNames = (name, index) => {
    let names;
    if (index < 0 || index > 5) {
      return;
    }
    if (name == null || name == "") {
      return;
    }
    if (
      cookies.player.charAt(0) != "R" &&
      ((index > 2 && cookies.player.charAt(0) != "2") ||
        (index < 3 && cookies.player.charAt(0) != "1"))
    ) {
      alert("you cannot change that player's name!");
      return;
    }
    if (index > 3) {
      names = [...identity.playerst2];
      names[index - 3] = name;
    } else {
      names = [...identity.playerst1];
      names[index] = name;
    }
    socket.current.send(
      JSON.stringify({
        type: "names",
        team: index > 3 ? "2" : "1",
        id: props.id,
        newNames: names,
      })
    );
  };
  const updateTeamNames = (name, team) => {
    // should be worried about offensive names but not like i can do anything
    if (
      cookies.player.charAt(0) == "R" ||
      parseInt(cookies.player.charAt(0)) == team
    ) {
      socket.current.send(
        JSON.stringify({
          type: "teamname",
          team: team,
          id: props.id,
          newName: name,
        })
      );
    } else {
      alert("you cannot change that team's name!");
    }
  };
  /**
   * Returns an object for styling information based on game progress.
   * @param {Number} timeDiff
   * @param {Boolean} varChecked
   * @returns an object containing display information
   */
  /*
  const parseTextColor = (timeDiff, varChecked = false) => {
    let color = "";
    let textColor = "white";
    if (timeDiff > 0.5 || (timeDiff > 0 && varChecked)) {
      color = "red";
    } else if (timeDiff <= 0.5 && timeDiff >= -0.5 && !varChecked) {
      //
      color = "yellow";
      textColor = "black";
    } else {
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
    const penaltyMenu = [
      "Retry",
      "DNF",
      "Ref Error",
      "VAR",
      "VAR/Updated",
      "Forced RT",
      "Tech",
    ]; // maybe add VAR/T1 wins, Var/T2 wins
    let deathMenu = [];
    switch (team) {
      case 1: {
        deathMenu = [...identity.playerst1];
        for (let i = 0; i < identity.penaltyt1[index].length; i++) {
          // looks like [[false, false, false], [false, false, false]]
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
          if (i < identity.playerst2.length && identity.deatht2[index][i]) {
            deathString += deathMenu[i] + ", ";
          }
        }
      }
    }

    return (
      <Fragment>
        <p style={{ color: "red", fontSize: 20 }}>
          <b>{`Penalties: `}</b>
          {`${penaltyString}`}
        </p>
        <p style={{ color: "blue", fontSize: 20 }}>
          <b>{`Deaths: `}</b>
          {`${deathString}`}
        </p>
      </Fragment>
    );
  };
  */
  const showSelectionAlert = (id, boss = false, ban = false) => {
    /*
    1. get character or boss from id
    2. get link by using character display name and append ".png"
    3. display the modal
    4. 2.5 seconds later, hide the modal
    */
    let path = "";
    let selection = "";
    if (boss) {
      selection = bossRef.current.get(id);
      path = getBossGifPath(selection);
      selection = BOSS_DETAIL[selection].displayName;
    } else {
      selection = characterRef.current.get(id);
      if (ban) {
        path = getCharacterBanPath(selection);
      } else {
        path = getCharacterGifPath(selection);
      }
      selection = CHARACTER_INFO[selection].displayName;
    }
    setLink(path);
    setAlertOpen(true);
    setTimeout(() => {
      setAlertOpen(false);
    }, 5000); // shows for 5 seconds, can be changed
  };
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
  };

  const updateSelectedDirect = (id, option) => {
    // option 1: update boss
    if (option == 1) {
      selectedBosses.current.push(id);
    } else if (option >= 2 && option <= 5) {
      selectedChars.current.push(id);
    }
  };
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
  const setupSocket = () => {
    if (window.timer) {
      clearInterval(window.timer);
      window.timer = 0;
    }
    if (socket.current.readyState == 1) {
      socket.current.send(
        JSON.stringify({
          type: "turn",
          id: props.id,
          getSelectionInfo: true,
        })
      );
      if (sessionStorage.getItem("game") == null) {
        socket.current.send(
          JSON.stringify({
            type: "get",
            id: props.id,
          })
        ); // should work if first connection is to here
      }
      if (sessionStorage.getItem("bosses") == null) {
        socket.current.send(
          JSON.stringify({
            type: "find",
            query: "boss",
          })
        );
      }
    }
  };
  const handleSocketMessage = (event) => {
    let data = JSON.parse(event.data);
    console.log("new data");
    console.log(data)
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
    if (data.type != "turn" && totalTime != TIMER) {
      setTotalTime(TIMER);
    }
    // console.log("data.type: " + data.type);
    switch (data.type) {
      case "create": {
        updateIdentity(data.game);
        break;
      }
      case "get": {
        updateIdentity(data.game);
        updateTurn(data.game.turn);
        if(data.game.totalBans == 6){
          setBanInfo([false, 3, 6]);
        }
        else{
          setBanInfo([true, 4, 8]);;
        }
        let pausedStorage = localStorage.getItem("timer");
        // if timer inactive then set timer
        if (data.time != -1 && pausedStorage === "false") {
          // data.time is -1 when game is not happening
          // make timer visible
          // console.log("setting tiomter");
          setTotalTime(data.time * 1000);
          updateTimer(true, false);
        }
        updateSelected(6);
        if (canPause && data.paused) {
          // console.log("must pause");
          // game is not paused, on server end it is paused
          setTimeout(() => {
            pauseDraft();
          }, 100);
        } else if (!canPause && !data.paused) {
          // console.log("must resume");
          // game is paused, server end is resumed
          setTimeout(() => {
            resumeDraft();
          }, 100);
        } else {
          // console.log("must chill");
        }
        break;
      }
      case "turn": {
        updateTurn(data.turn);
        if (data.timer != -1 && localStorage.getItem("timer") === "false") {
          setTotalTime(data.timer * 1000);
          updateTimer(true, false);
        }
        if (canPause && data.paused) {
          // game is not paused, on server end it is paused
          setTimeout(() => {
            pauseDraft();
          }, 100);
        } else if (!canPause && !data.paused) {
          // game is paused, server end is resumed
          setTimeout(() => {
            resumeDraft();
          }, 100);
        }
        // check for pause here too
        break;
      }
      case "boss": {
        updateTimer(true, true);
        res = parseBoss(data);
        updateSelectedDirect(data.boss, 1);
        showSelectionAlert(data.boss, true, false);
        break;
      }
      case "complete": {
        break; // do nothing
      }
      case "DND": {
        switch (data.where) {
          case "boss":
            res = {
              ...identity,
              bosses: data.newResult,
            };
            break;
          case "t1":
            res = {
              ...identity,
              pickst1: data.newPicks,
            };
            break;
          case "t2":
            res = {
              ...identity,
              pickst2: data.newPicks,
            };
            break;
        }
        break;
      }

      // should only execute if extra ban setting is enabled
      case "extraban":
      case "ban": {
        console.log("current ban");
        updateTimer(true, true);
        res = parseBan(data, data.type == "extraban");
        if (data.type == "extraban") {
          updateSelectedDirect(data.extraban, 2);
          showSelectionAlert(data.extraban, false, true);
        } else {
          updateSelectedDirect(data.ban, 2);
          showSelectionAlert(data.ban, false, true);
        }
        break;
      }
      case "pick": {
        console.log("current pick");
        updateTimer(true, true);
        res = parsePick(data);
        updateSelectedDirect(data.pick, 3);
        showSelectionAlert(data.pick, false, false);
        break;
      }
      case "pause":
        pauseDraft();
        break;
      case "resume":
        resumeDraft();
        break;
      case "times": {
        // info.data is in format of a three digit array: [team (1 or 2), boss number (0 to 6 or 8 depends on division), new time]
        res = parseTimes(data.time);
        break;
      }
      case "names": {
        res = {
          ...identity,
          [`playerst${data.team}`]: data.names,
        };
        break;
      }
      case "teamname": {
        res = {
          ...identity,
          [`team${data.team}`]: data.newName,
        };
        break;
      }
      case "overwrite": {
        // identity was replaced but did not save?
        let tempInfo = JSON.parse(sessionStorage.getItem("game"));
        // bandage fix - not much i can do until i start working on a long term plan to shift to redux
        res = {
          ...identity,
          result: tempInfo.result,
          [`${data.which}`]: data.replacement,
        };
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
              info += `Player ${i + 1} has joined: ${data.playerStatus[i]}\n`;
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
          if (cookies.player.charAt(0) != "S") {
            alert("Draft starts now!");
          }
        } else if (data.newPhase == "ban" || data.newPhase == "pick") {
          updateTimer(true, true);
        }
        res = {
          ...identity,
          result: data.newPhase,
        };
        break;
      }
    }
    if (res != null) {
      /*
      console.log("new res")
      console.log(res);
      console.log("old identity");
      console.log(identity);
      */
      updateIdentity(res);
      updateTurn(res.turn);
    }
    if (data.type == "overwrite") {
      setTimeout(() => {
        updateSelected(6); // can be optimized based on what changed
      }, 100);
    }
  };
  const pauseDraft = () => {
    // maybe clear the timer?
    // i.e. remove it and readd it?
    if (countdownRef.current != null) {
      console.log("pausing draft");
      // if the time has been changed, get the timer value
      countdownRef.current.getApi().pause();
      // solution: reset timer?
      // meaning get info from timer
      setPause(false);
      setActive(false);
    } else {
      console.log("cannot pause draft");
    }
  };
  const resumeDraft = () => {
    if (countdownRef.current != null) {
      countdownRef.current.getApi().start();
      setPause(true);
      setActive(true);
    }
  };
  /*
  const createSocket = () => {
    // test
    let uuid = localStorage.getItem("userid");
    if (uuid == null) {
      uuid = crypto.randomUUID();
      localStorage.setItem("userid", uuid);
    }
    if (socket.current != null) {
      if (
        socket.current.readyState == WebSocket.OPEN ||
        socket.current.readyState == WebSocket.CONNECTING
      ) {
        return null; // essentially do nothing
      }
    }
    let socketOpts = [
      `wss://rankedwebsocketapi.fly.dev?userId=${uuid}`,
      `ws://localhost:3000?userId=${uuid}`,
    ];
    let newSocket = new WebSocket(socketOpts[1]); // wss://rankedwebsocketapi.fly.dev or ws://localhost:3000
    newSocket.addEventListener("open", function (event) {
      console.log("socket opened here");
      setupSocket();
    });
    if (typeof cookies.player == "undefined") {
      setCookie("player", "spectate");
    }
    // Listen for messages
    newSocket.addEventListener("message", function (event) {
      // console.log(JSON.parse(event.data));
      // console.log("^^^^");
      handleSocketMessage(event);
    });
    newSocket.addEventListener("close", function (event) {
      handleSocketClose(event.data);
    });
    newSocket.addEventListener("error", function (event) {
      console.log("An error occured");
      socket.current.close();
    });
    // console.log("socket build")
    return newSocket;
  };
  const handleSocketClose = () => {
    console.log("closed");
    /*
    if (!window.timer) {
      window.timer = setInterval(() => {
        socket.current = createSocket();
        // this should never be null
      }, 500);
    }
    */
  /*
    socket.current.close();
  };
  */

  /*
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
  */
  const openChange = (team, name, original) => {
    if (cookies.player.charAt(0) != "R") {
      // reject
      alert("you can only change bosses/characters as a ref!");
      return;
    }
    if (identity.result == "waiting") {
      alert("start the draft first!");
      return;
    }
    if (
      canPause &&
      identity.result != "progress" &&
      identity.result != "finish"
    ) {
      alert("pause the draft first!");
      return;
    }
    let info = ["", "", 0, 0];
    if (team == 0) {
      info[0] = "boss";
    } else {
      if (original > 14) {
        info[0] = "extraban";
        original = original - 15;
      } else if (original > -1) {
        info[0] = "character";
      } // need to differentiate between ban and extra ban
      else {
        info[0] = "ban";
        original = original * -1 - 1;
      }
    }

    // add 15 to extra ban i guess?
    info[1] = name;
    info[2] = team;
    info[3] = original;
    setChangeInfo(info);
    setShowChanges(true);
  };

  const handleChange = (change, team) => {
    // if a character or boss must be changed for whatever reason and refs agree to it
    // this is what happens
    // tell which to overwrite, in terms of id

    // doesnt handle appropriately which one is changed, so maybe add an index field too?
    // so it knows which one was the original
    // to allow changing boss?
    // yeah
    // need to
    console.log("change: " + change);
    let res = parseInt(change);
    if (isNaN(res)) {
      if (changeInfo[0] == "boss") {
        bosses.forEach((boss) => {
          if (boss.boss.toLowerCase() == change.toLowerCase()) {
            res = boss._id;
          }
        });
      } else {
        characters.forEach((char) => {
          if (char.name.toLowerCase() == change.toLowerCase()) {
            res = char._id;
          }
        });
      }
    }
    if (isNaN(res)) {
      // ask for proper input
      if (changeInfo[0] == "boss") {
        alert("The boss name specified is invalid!");
      } else {
        alert("The character name specified is invalid!");
      }
      return;
    }
    setShowChanges(false);
    if (cookies.player.charAt(0) != "R") {
      // reject
      return;
    }
    /*
    if (identity.result != "progress") {
      alert("Please do not change characters mid round!");
      return;
    }
    */
    socket.current.send(
      JSON.stringify({
        type: "overwrite",
        id: props.id,
        team: team,
        which: changeInfo[0],
        original: changeInfo[3],
        replacement: res,
      })
    );
    // find the original and replace it
  };
  const handleDND = (event) => {
    // what must be done to handle a drag and drop situation?
    // assuming i know the first and second ids, i can tell the socket to move the characters or bosses
    // can be handled by a simple socket.send
    if(cookies.player.charAt(0) != "R"){
      return;
    }
    const { active, over } = event;
    let vals = [active.id];
    if (over != null) {
      vals.push(over.id);
    } else {
      return;
    }
    // this will send values and id to socket
    let info = {
      type: "dnd",
      id: props.id,
      where: dndRef.current,
      values: vals,
    };

    socket.current.send(JSON.stringify(info));
    dndRef.current = "boss";
    // here
    // send to socket, socket rejects if wrong phase
    // not ideally any, but unclear what the type of event is
    // need
    // to figure out what is the dragged event and what is the dropped event
  };
  const handleT1DND = (event) => {
    dndRef.current = "t1";
    handleDND(event);
  };
  const handleT2DND = (event) => {
    dndRef.current = "t2";
    handleDND(event);
  };

  // split the page into three parts, 25% / 50% / 25% (ish - grid takes cares of this)
  let bans =
    sessionStorage.getItem("totalbans") == "2+1"
      ? [0, 2, 5, 1, 3, 4]
      : [0, 2, 4, 7, 1, 3, 5, 6];
  // console.log("ban info: "+banInfo);
  let timeOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const limit = identity.bosses == undefined ? 0 : identity.bosses.length;
  let extraBanCounter = 0;
  let extraBanOrder = [[], []];
  if (identity.extrabans.length > 0) {
    // creates extra ban order based on the number of extra bans of each team
    // alternates 1 - 2 - 1 - 2 - 1 - 2 until a team runs out of extra bans, which then the rest are the other team's
    for (
      let i = 0;
      i < Math.max(identity.extrabanst1, identity.extrabanst2);
      i++
    ) {
      if (i < identity.extrabanst1) {
        extraBanOrder[0].push(extraBanCounter);
        extraBanCounter++;
      }
      if (i < identity.extrabanst2) {
        extraBanOrder[1].push(extraBanCounter);
        extraBanCounter++;
      }
    }
  }
  // add pause, waiting, game over
  let choice = !banInfo[0] ? "container" : "bigcontainer"
  return (
    <div>
      <title>
        {!canPause
          ? "draft paused. ID " + props.id
          : identity.result == "waiting"
          ? "waiting for game ID " + props.id
          : identity.result == "progress" || identity.result == "finish"
          ? "draft over"
          : cookies.player.charAt(0) == "" + turn
          ? "YOUR TURN! ID " + props.id
          : cookies.player.charAt(0) == "R" || cookies.player.charAt(0) == "S"
          ? identity["team" + turn] + " 's turn! ID " + props.id
          : "enemy turn! ID " + props.id}
      </title>
      {sessionStorage.getItem("game") == null ||
      sessionStorage.getItem("bosses") == null ||
      sessionStorage.getItem("characters") == null ||
      identity.connected == [0, 0, 0] ? (
        <p>your page is currently loading!</p>
      ) : (
        <Fragment>
          <div className={choice}>
            <div
              className="grid one"
              style={{
                textAlign: "left", // can change to center
              }}
              onClick={() =>
                updateTeamNames(prompt("enter a new name for team 1:"), 1)
              }
            >
              {typeof identity.team1 == undefined
                ? "team 1 selections"
                : identity.team1 + " picks"}
            </div>
            <div className="grid two">
              <Grid container columns={4}>
                <Grid size={1}>
                  <p>
                    {cookies.player.charAt(0) == "1"
                      ? "you are team 1."
                      : cookies.player.charAt(0) == "2"
                      ? "you are team 2."
                      : null}
                  </p>
                </Grid>
                <Grid size={1}>
                  <div>
                    {/* console.log(identity.result == "progress" || identity.result == "finish") */}
                    {!canPause ? (
                      <MyTurn turnInfo={3} draftOver={false} />
                    ) : (
                      <MyTurn
                        turnInfo={turn == 1 ? 1 : 2}
                        draftOver={
                          identity.result == "progress" ||
                          identity.result == "finish"
                        }
                      />
                    )}
                  </div>
                </Grid>
                <Grid size={1}>
                  <p>
                    {identity.result == "progress" ||
                    identity.result == "finish"
                      ? null
                      : identity.result != "waiting"
                      ? "select a " + identity.result.toLowerCase()
                      : "waiting to start"}
                  </p>
                </Grid>
                <Grid size={1}>
                  {identity.result != "progress" ? (
                    showTimer ? (
                      <Countdown
                        date={timer + totalTime}
                        ref={countdownRef}
                        onComplete={() => {
                          updateTimer(false, true);
                        }}
                      />
                    ) : (
                      <p>timer inactive</p>
                    )
                  ) : null}
                </Grid>
              </Grid>
            </div>
            <div
              className="grid three"
              onClick={() =>
                updateTeamNames(prompt("enter a new name for team 2:"), 2)
              }
            >
              {typeof identity.team2 == undefined
                ? "team 2 selections"
                : identity.team2 + " picks"}
            </div>
            <div className="grid four">
              <Grid container direction="row" columns={6} spacing={2.5}>
                <DndContext
                  onDragEnd={handleT1DND}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                >
                  {Array.from(Array(6)).map((_, ind) => {
                    return (
                      <Grid
                        container
                        size={4}
                        offset={1.3}
                        direction="row"
                        key={ind}
                      >
                        {characterRef.current != undefined
                          ? displayCharacter(
                              // change to work on bans too, again same cond only ref can change
                              characterRef.current.get(
                                identity.pickst1[ind]._id
                              ),
                              true,
                              1,
                              ind,
                              openChange
                            )
                          : null}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          paddingLeft={2}
                          onClick={() => {
                            ind % 2 == 0
                              ? updateNames(
                                  prompt(
                                    "Enter a new name for team 1 player " +
                                      (ind / 2 + 1) +
                                      ":",
                                    ""
                                  ),
                                  ind / 2
                                )
                              : null;
                          }}
                        >
                          {ind % 2 == 0
                            ? typeof identity.playerst1 == "undefined" ||
                              typeof identity.playerst1[ind / 2] == "undefined"
                              ? "player " + ind / 2
                              : "  " + identity.playerst1[ind / 2]
                            : ""}
                        </Box>
                      </Grid>
                    );
                  })}
                </DndContext>
              </Grid>
            </div>
            <div
              ref={(el) => {
                // borrowed code
                if (!el) return;
                let prevValue = JSON.stringify(el.getBoundingClientRect());
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
                cookies.player.charAt(0) == "S"
                  ? { minWidth: 1080 }
                  : null
              }
            >
              <div>
                {cookies.player.charAt(0) != "S" ? (
                  identity.result.toLowerCase() == "waiting" ||
                  identity.result.toLowerCase() == "boss" ? (
                    <BossDisplay
                      fearless={identity.fearless}
                      team={
                        cookies.player.charAt(0) == "1"
                          ? 1
                          : cookies.player.charAt(0) == "2"
                          ? 2
                          : -1
                      }
                      pickSelection={sendSelection}
                      sendHover={sendHover}
                      inGame={true}
                      bonusInfo={[extraInfo]}
                      selections={selectedBosses.current}
                      active={active}
                    />
                  ) : identity.result.toLowerCase() == "ban" ||
                    identity.result.toLowerCase() == "pick" ||
                    identity.result.toLowerCase() == "extraban" ? (
                    <Balancing
                      team={
                        cookies.player.charAt(0) == "1"
                          ? 1
                          : cookies.player.charAt(0) == "2"
                          ? 2
                          : -1
                      }
                      phase={identity.result.toLowerCase()}
                      pickSelection={sendSelection}
                      sendHover={sendHover}
                      inGame={true}
                      bonusInfo={[extraInfo]}
                      selections={selectedChars.current}
                      active={active}
                    />
                  ) : null
                ) : null}
              </div>
              <div>
                {identity.result.toLowerCase() == "progress" ||
                cookies.player.charAt(0) == "S" ? (
                  <p>thank you for drafting!</p>
                ) : null}
              </div>
            </div>
            <div className="grid seven">
              <Grid
                container
                direction="row"
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                columns={6}
                spacing={2.5}
              >
                <DndContext
                  onDragEnd={handleT2DND}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                >
                  {Array.from(Array(6)).map((_, ind) => {
                    return (
                      <Grid
                        container
                        size={4}
                        offset={1.3}
                        direction="row"
                        key={ind}
                      >
                        {characterRef.current != undefined
                          ? displayCharacter(
                              characterRef.current.get(
                                identity.pickst2[ind]._id
                              ),
                              true,
                              2,
                              ind,
                              openChange
                            )
                          : null}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          paddingLeft={2}
                          onClick={() => {
                            ind % 2 == 0
                              ? updateNames(
                                  prompt(
                                    "Enter a new name for team 2 player " +
                                      (ind / 2 + 1) +
                                      ":",
                                    ""
                                  ),
                                  ind / 2 + 3
                                )
                              : null;
                          }}
                        >
                          {ind % 2 == 0
                            ? typeof identity.playerst2 == "undefined" ||
                              typeof identity.playerst2[ind / 2] == "undefined"
                              ? "player " + ind / 2
                              : identity.playerst2[ind / 2]
                            : ""}
                        </Box>
                      </Grid>
                    );
                  })}
                </DndContext>
              </Grid>
            </div>
            <div className="grid nine">
              {cookies.player.charAt(0) == "R" ? (
                <Grid container columns={5} spacing={1}>
                  <Fragment>
                    <Grid offset={3} size={1}>
                      <Button
                        fullWidth
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
                        <Typography textTransform="none">
                          check players
                        </Typography>
                      </Button>
                    </Grid>
                    {identity.result != "waiting" ? (
                      <Fragment>
                        {identity.result == "progress" ? (
                          <Grid size={1}>
                            <Button
                              sx={{ backgroundColor: "black", color: "yellow" }}
                              fullWidth
                              onClick={() => {
                                socket.current.send(
                                  JSON.stringify({
                                    type: "switch",
                                    phase: "finish",
                                    id: props.id,
                                  })
                                );
                              }}
                            >
                              <Typography textTransform="none">
                                end game
                              </Typography>
                            </Button>
                          </Grid>
                        ) : null}
                        {canPause &&
                        identity.result != "progress" &&
                        identity.result != "finish" ? (
                          <Grid size={1}>
                            <Button
                              sx={{ backgroundColor: "black", color: "yellow" }}
                              fullWidth
                              onClick={() => {
                                socket.current.send(
                                  JSON.stringify({
                                    type: "pause",
                                    id: props.id,
                                  })
                                );
                              }}
                            >
                              <Typography textTransform="none">
                                pause
                              </Typography>
                            </Button>
                          </Grid>
                        ) : identity.result != "progress" &&
                          identity.result != "finish" ? (
                          <Grid size={1}>
                            <Button
                              sx={{ backgroundColor: "black", color: "yellow" }}
                              fullWidth
                              onClick={() => {
                                socket.current.send(
                                  JSON.stringify({
                                    type: "resume",
                                    id: props.id,
                                  })
                                );
                              }}
                            >
                              <Typography textTransform="none">
                                resume
                              </Typography>
                            </Button>
                          </Grid>
                        ) : null}
                      </Fragment>
                    ) : (
                      <Grid size={1}>
                        <Button
                          className="boss-4"
                          sx={{ backgroundColor: "black", color: "yellow" }}
                          fullWidth
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
                          <Typography textTransform="none">
                            start game
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                  </Fragment>
                </Grid>
              ) : null}
            </div>
            <div className="grid eleven">
              <Grid container paddingLeft={1} spacing={2.2}>
                {bans.slice(0, banInfo[1]).map((ban) => {
                  return (
                    <div key={ban}>
                      {characterRef.current != undefined
                        ? displayCharacter(
                            characterRef.current.get(identity.bans[ban]._id),
                            false,
                            1,
                            -1 * (ban + 1),
                            openChange
                          )
                        : null}
                    </div>
                  );
                })}
              </Grid>
            </div>
            <div className="grid twelve">
              <Grid
                container
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 1,
                  paddingRight: 5,
                }}
                spacing={8}
                columns={identity.bosses.length}
              >
                <DndContext
                  onDragEnd={handleDND}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToHorizontalAxis]}
                >
                  {timeOrder.slice(0, limit).map((time) => {
                    return (
                      <Grid size={1} key={time}>
                        {bossRef.current != undefined
                          ? displayBoss(
                              bossRef.current.get(identity.bosses[time]._id),
                              time,
                              openChange
                            )
                          : null}
                      </Grid>
                    );
                  })}
                </DndContext>
              </Grid>
            </div>
            <div className="grid thirteen">
              <Grid
                container
                justifyContent="end"
                sx={{ paddingRight: 1 }}
                spacing={2.2}
              >
                {bans.slice(banInfo[1], banInfo[2]).map((ban) => {
                  return (
                    <div key={ban}>
                      {characterRef.current != undefined
                        ? displayCharacter(
                            characterRef.current.get(identity.bans[ban]._id),
                            false,
                            2,
                            -1 * (ban + 1),
                            openChange
                          )
                        : null}
                    </div>
                  );
                })}
              </Grid>
            </div>
            {identity.extrabanst1 > 0 ? (
              <div className="grid fourteen">extra bans (team 1)</div>
            ) : null}
            {identity.extrabanst2 > 0 ? (
              <div className="grid sixteen">extra bans (team 2)</div>
            ) : null}
            <div className="grid seventeen">
              {identity.extrabanst1 > 0 ? (
                <Grid
                  container
                  justifyContent="center"
                  sx={{ paddingLeft: 1 }}
                  spacing={identity.extrabanst1}
                >
                  {extraBanOrder[0].map((ban, index) => {
                    return (
                      <div key={index} size={1}>
                        {characterRef.current != undefined
                          ? displayCharacter(
                              characterRef.current.get(
                                identity.extrabans[ban]._id
                              ),
                              false,
                              1,
                              ban + 15,
                              openChange
                            )
                          : null}
                      </div>
                    );
                  })}
                </Grid>
              ) : null}
            </div>
            <div className="grid nineteen">
              {/* extra bans */}
              <Grid container justifyContent="center" spacing={2}>
                {identity.extrabanst2 > 0
                  ? extraBanOrder[1].map((ban, index) => {
                      return (
                        <div key={index} size={1}>
                          {characterRef.current != undefined
                            ? displayCharacter(
                                characterRef.current.get(
                                  identity.extrabans[ban]._id
                                ),
                                false,
                                2,
                                ban + 15,
                                openChange
                              )
                            : null}
                        </div>
                      );
                    })
                  : null}
              </Grid>
            </div>
            <div className="grid twenty">
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
            <div className="grid twentytwo">
              <Button
                style={{ backgroundColor: "black", color: "yellow" }}
                fullWidth
                onClick={() => {
                  socket.current.send(
                    JSON.stringify({
                      type: "get",
                      from: "refresh info",
                      id: props.id,
                    })
                  );
                }}
              >
                <Typography textTransform="none">refresh game info</Typography>{" "}
                {/* should check for paused game */}
              </Button>
            </div>
          </div>
          {/*
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
          */}
          {/*
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
            */}
          <ChangeModal
            open={showChanges}
            close={() => setShowChanges(false)}
            change={handleChange}
            type={changeInfo[0]}
            name={changeInfo[1]}
            team={changeInfo[2]}
          />
          <GifPlay link={alertLink} isOpen={alertOpen} />
        </Fragment>
      )}
    </div>
  );
}

export default Game;