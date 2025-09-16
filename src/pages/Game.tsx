import {useState, useEffect, useRef, Fragment, FC} from "react";
import {useCookies} from "react-cookie";
import "./css/Playing.css";
import "./css/Gameplay.css";
// import OrderModal from "./OrderModal.tsx";
import Countdown from "react-countdown";

import {Balancing} from "../../frontend/src/routes/balancing.tsx";
import {BossDisplay} from "../../frontend/src/routes/bosses.tsx";

import {BOSS_DETAIL} from "@genshin-ranked/shared/src/types/bosses/details.ts";
import {CHARACTER_INFO} from "@genshin-ranked/shared/src/types/characters/details.ts"; 
import {displayBoss, displayCharacter} from "../components/DisplayComponent.tsx";
import {getBossGifPath, getCharacterBanPath, getCharacterGifPath} from "@genshin-ranked/shared/src/utils/imagePaths.ts"

import {Box, Button, Typography, Grid, useMediaQuery, useTheme} from "@mui/material";
import {GifPlay} from "../components/GifPlay.tsx";
import {DndContext, closestCenter} from "@dnd-kit/core";
import {restrictToHorizontalAxis, restrictToVerticalAxis} from "@dnd-kit/modifiers";
import ChangeModal from "./ChangeModal.tsx";
import {CHARACTERS} from "@genshin-ranked/shared";
import {BOSSES} from "@genshin-ranked/shared";
import {BOSS_TYPE} from "@genshin-ranked/shared/src/types/level.ts";
import type {DragEndEvent} from "@dnd-kit/core";
import {useAppSelector, useAppDispatch} from "../hooks/ReduxHooks.ts";
import {addGame, addName, dragAndDrop, GameWebInterface, setTurn, PlayerInfo, addTeamName, addExtraBan, addCharacter, addBoss, changePhase, GameInterface, totalBans} from "../GameReduce/gameSlice.ts";
import {chosenBosses, chosenCharacters, overrideBoss, overrideCharacter, selectBoss, selectBan, selectExtraBan, selectPickT1, selectPickT2, overrideAllCharacters, chosenBans, chosenExtraBans, chosenPicksT1, chosenPicksT2, hoveredCharacter, hoveredBoss} from "../GameReduce/selectionSlice.ts";
import ExtraBanDisplay from "./ExtraBanComponent.tsx";
const IMG_SIZE = 75; // use eventually
// redux good for handling and modifying game information?
const TIMER = 35500;

interface SocketMessage {
  type: string,
  id: number,
  message: string,
  error?: string,
  errType?: string,
  requesterOnly?: boolean
}
interface SocketMessageWithGame extends SocketMessage {
  game: GameWebInterface,
  paused: boolean,
  time: number
}
interface SocketBossMessage extends SocketMessage {
  boss: number,
  long: boolean,
  team: number,
  nextTeam: number
}
interface SocketBanMessage extends SocketMessage {
  ban: number,
  team: number,
  nextTeam: number
}
interface SocketPickMessage extends SocketMessage {
  pick: number,
  team: number,
  nextTeam: number
}
interface SocketPhaseMessage extends SocketMessage {
  newPhase: string
}
interface SocketDNDMessage extends SocketMessage {
  where: string,
  first: number,
  second: number
}
interface SocketTurnMessage extends SocketMessage {
  paused: boolean,
  turn: number,
  timer: number
}
interface SocketConnectedMessage extends SocketMessage {
  playerStatus: number[];
}
interface SocketOverwriteMessage extends SocketMessage {
  which: string,
  original: number,
  replacement: number,
  long?: boolean
}
interface SocketPlayerNameMessage extends SocketMessage {
  team: number,
  newNames: string[]
}
interface SocketPauseResumeMessage extends SocketMessage {
  timer: number
}
interface SocketTeamNameMessage extends SocketMessage {
  team: number,
  teamName: string
}
interface SocketLatestMessage extends SocketMessage {
  boss: number,
  character: number
}
const Game = (props: {socket: WebSocket, id: number;}) => {
  // the actual meat of the game, including picks / bans / etc
  const identity = useAppSelector((state) => state.game);
  // const [selection, setSelection] = useState({}); // what character they choose
  // const [update, setUpdate] = useState(false);
  const turn = useAppSelector((state) => state.game.turn); // current turn
  const hoverBoss = useAppSelector(hoveredBoss);
  const hoverCharacter = useAppSelector(hoveredCharacter);
  const [cookies, setCookie] = useCookies(["player"]); // replace cookies for a player for redux???
  const socket: React.RefObject<WebSocket> = useRef(props.socket);

  const [banInfo, setBanInfo] = useState([0, 3, 6]);
  // in order: 8 bans (3 + 1), ban split 1, ban split 2

  // const [showT1Modal, setShowT1] = useState(false);
  // const [showT2Modal, setShowT2] = useState(false);

  const [canPause, setPause] = useState(true); // true or false - can the game be paused
  const [showChanges, setShowChanges] = useState(false);
  const [changeInfo, setChangeInfo] = useState(["", "", "1", "-1"]); 
  // in order: type, name, team (1 or 2, 0 if boss), id
  const [showTimer, setTimerVisible] = useState(false);
  const [timer, setTimerValue] = useState(Date.now());

  const [alertLink, setLink] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  // const [alertBan, setAlertBan] = useState(false);

  const countdownRef = useRef<Countdown>(null);

  const charRef = useRef(new Map<number, CHARACTERS>());
  const bossRef = useRef(new Map<number, BOSSES>());
  const bossNameRef = useRef(new Map<string, number>());
  const charNameRef = useRef(new Map<string, number>());
  const dndRef = useRef("boss");
  const latestRef = useRef([-1,-1]);
  const selectedBosses = useAppSelector(chosenBosses);
  const selectedChars = useAppSelector(chosenCharacters);
  const selectedExtraBans = useAppSelector(chosenExtraBans);
  const selectedBans = useAppSelector(chosenBans);
  const selectedPicksT1 = useAppSelector(chosenPicksT1);
  const selectedPicksT2 = useAppSelector(chosenPicksT2);
  const gameTextSize = {xs: "0.5rem", sm: "0.75rem", md: "0.9rem", lg: "1rem", xl: "1.3rem"};
  const [extraInfo, setExtraInfo] = useState(""); // info to send to the balancing / bosses text
  const [totalTime, setTotalTime] = useState(0); // total time for timer
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMediumOrBigger = useMediaQuery(theme.breakpoints.up("md"));
  useEffect(() => {
    // adds selected characters and bosses to the ref objects
    localStorage.setItem("timer", "false");
    // updateSelected(6);
    for (const someName in BOSS_DETAIL) {
      // create a hashmap between index and some name
      bossRef.current.set(
        BOSS_DETAIL[someName as keyof typeof BOSSES].index,
        BOSSES[someName as keyof typeof BOSSES]
      );
      bossNameRef.current.set(
        BOSS_DETAIL[someName as keyof typeof BOSSES].displayName.toLowerCase(),
        BOSS_DETAIL[someName as keyof typeof BOSSES].index
      );
    }
    for (const someName in CHARACTER_INFO) {
      charRef.current.set(CHARACTER_INFO[someName as keyof typeof CHARACTERS].index, CHARACTERS[someName as keyof typeof CHARACTERS]);
      charNameRef.current.set(CHARACTER_INFO[someName as keyof typeof CHARACTERS].displayName.toLowerCase(), CHARACTER_INFO[someName as keyof typeof CHARACTERS].index);
    }
    // probably move these to another store / reducer
    setupSocket();
    const handleMessage = (event: MessageEvent) => {
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
    const handleError = (event: Event) => {
      console.log("An error occured");
      console.log((event as MessageEvent).data);
      socket.current.close();
    };
    socket.current.addEventListener("error", handleError);
    // get latest from socket
    return () => {
      if (socket.current.readyState == WebSocket.OPEN) {
        // socket.current.close();
        // close event listeners?
        socket.current.removeEventListener("message", handleMessage);
        socket.current.removeEventListener("close", handleClose);
        socket.current.removeEventListener("error", handleError);
      }
    };
  }, []);

  useEffect(() => {
    updateSelected(1);
  }, [identity.bosses])
  useEffect(() => {
    updateSelected(2);
  }, [identity.extrabans]);
  useEffect(() => {
    updateSelected(3);
  }, [identity.bans]);
  useEffect(() => {
    updateSelected(4);
  }, [identity.pickst1])
  useEffect(() => {
    updateSelected(5);
  }, [identity.pickst2]);
  
const MyTurn: FC<{turnInfo: number, draftOver: boolean}> = ({turnInfo, draftOver}) => {
  if (draftOver) {
    return <></>;
  }
  if (turnInfo == 3) {
    return <p style={{ color: "white"}}> draft paused</p>;
  }
  const [cookieInfo] = useCookies(["player"]);
  if ("" + turnInfo == cookieInfo.player.substring(0, 1)) {
    return <p style={{ color: "green"}}>your turn!</p>;
  } else if (
    (cookieInfo.player.substring(0, 1) == "1" ||
      cookieInfo.player.substring(0, 1) == "2") &&
    turnInfo > 0
  ) {
    return <p style={{ color: "red"}}>opponent's turn!</p>;
  } else {
    return (
      <p style={{ color: "white" }}>
        team {turnInfo}'s turn!
      </p>
    );
  }
};
// also unused 
/*
const parseUpdate = (data) => {
  // console.log(identity);
  // console.log("identity");
  let newIden = null;
  // arrange order
  let newOrder: number[] = [];
  for (let i = 0; i < identity.pickst1.length; i++) {
    newOrder.push(identity[`pickst${data.team}`][data.order[i]]);
  }
  if (data.team != 1 && data.team != 2) {
    newIden = { ...identity };
  } else {
    newIden = {
      ...identity,
      [`playerst${data.team}`]: data.playerNames,
      [`team${data.team}`]: data.teamName,
      [`pickst${data.team}`]: newOrder,
    };
  }
  return newIden;
  // team information
};
*/
// currently unused
/*
const parseStatus = (data) => {
  // update team information
  let newIden = null;
  switch (data.team) {
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
  }
  return newIden;
}; 
*/
  // set an interval
  /**
   * updates timer information.
   * @param {boolean} enabled whether the timer is meant to be enabled or not
   * @param {boolean} resetTime whether to reset the timer or not
   */
  const updateTimer = (enabled: boolean = true, resetTime: boolean) => {
    if (totalTime != TIMER && resetTime) {
      // reset timer after refresh page
      setTotalTime(TIMER);
    }
    if (enabled) {
      setTimerValue(Date.now());
    }
    setTimerVisible(enabled);
    localStorage.setItem("timer", enabled + "");
  };
  const checkSelection = (selection: number, type: string) => {
    //
    if (selection == -1) {
      console.log("none selected");
      return true;
    }
    switch (type) {
      case "boss":
        // check id and check name
        // console.log(bossInfo);
        if (selectedBosses.includes(selection)) {
          return false;
        }
        break;
      case "ban":
      case "pick":
      case "extraban":
        if (selectedChars.includes(selection)) {
          // pick is already chosen or banned
          return false;
        }
        break;
      default:
        return false;
    }
    return true;
  };

  const sendHover = (teamNum: number, selection: number) => {
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

  const sendSelection = (teamNum: number, selection: number, type: string, timeout = false): void => {
    // should no longer be run on timer end
    // instead server will handle it
    // assumes coket is open which should always be the case
    console.log("team "+teamNum+" selected "+selection+" for "+type);
    if (socket.current.readyState != 1) {
      alert("Please refresh the page and try again!");
      return;
    }
    if (!canPause) {
      alert("The game is currently paused!");
      return;
    }
    let gameID = props.id;
    // verify the same boss / pick is not already chosen
    // boss, pick, etc
    let res = identity.result;
    res == "waiting" ? res = "boss" : res;
    let req = "";
    if (identity.fearless) {
      if (selection >= 0 && type == "boss" && identity.fearlessBosses.includes(selection)) {
        setExtraInfo("This boss was picked in the previous match!");
        return;
      }
    }
    let found = false;
    if(selection == -3 || selection == -2){
      // set to -3 if not ban
      if(res.toLowerCase() == "ban" || res.toLowerCase() == "extraban"){
        selection = -2; // no ban
      }
      else{
        selection = -3; // random
      }
      req = JSON.stringify({
        id: gameID,
        type: "add",
        changed: identity.result,
        data: {
          character: selection,
          boss: selection,
          team: teamNum,
        },
      });
    }
    else if (selection == -1) {
      setExtraInfo("No selection was made! Random boss / pick or no ban is selected.");
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
      if (
        type == "boss" &&
        BOSS_DETAIL[bossRef.current.get(selection) ?? BOSSES.None].type == BOSS_TYPE.Legend &&
        identity.division != "premier"
      ) {
        if (timeout) {
          setExtraInfo("Time is up! Local legends cannot be played in your division. A random boss will be selected.");
          found = true;
        } else {
          setExtraInfo("You cannot pick legends in standard division!");
          return;
        }
      }
      if (
        !found &&
        ((type == "boss" && res.toLowerCase() != "boss") ||
          (type == "character" &&
            res.toLowerCase() != "ban" &&
            res.toLowerCase() != "pick" &&
            res.toLowerCase() != "extraban"))
      ) {
        setExtraInfo("selection invalid!");
        selection = -3;
      } else if (
        type == "boss" &&
        identity.longBoss[teamNum - 1] &&
        BOSS_DETAIL[bossRef.current.get(selection) ?? BOSSES.None].type != BOSS_TYPE.Standard
      ) {
        setExtraInfo("You cannot pick more than one long boss in standard division (two in premier division)!");
        if (timeout) {
          found = true;
        } else {
          return;
        }
      }
      // implement check for long bosses / weeklies, all weeklies are long so i can just implement long boss check
      
      if (!checkSelection(selection, res)) {
        if (timeout) {
          if (type == "boss") {
            setExtraInfo("Time is up! An invalid boss was selected, thereby a random boss will be chosen.");
          } else if (type == "character") {
            if (identity.result == "ban") {
              setExtraInfo("Time is up. An invalid character was selected, thereby no ban will be chosen.");
            } else {
              setExtraInfo("Time is up. An invalid character was selected, thereby a random pick will be selected.");
            }
          }
          found = true;
        } else {
          if (type == "boss") {
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
          return;
        }
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
          character: selection,
          boss: selection,
          team: teamNum,
        },
      });
    }
    updateTimer(false, true);
    // console.log("request");
    // console.log(req);
    console.log("sent from sendselectione");
    if (found == false) {
      setExtraInfo(""); // reset on success
    } else {
      // 10 second timeout, then clear
      setTimeout(() => {
        setExtraInfo("");
      }, 15000);
    }
    socket.current.send(req);
  };
  const updateNames = (name: string | null | undefined, index: number) => {
    let names: string[];
    if (index < 0 || index > 5) {
      // 0 is first, 5 is last
      return;
    }
    if (name == null || name == "" || name == undefined) {
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
  const updateTeamNames = (name: string | null, team: number) => {
    // should be worried about offensive names but not like i can do anything
    if(name == null){
      return;
    }
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
  const showSelectionAlert = (id: number, boss = false, ban = false) => {
    /*
    1. get character or boss from id
    2. get link by using character display name and append ".png"
    3. display the modal
    4. 2.5 seconds later, hide the modal
    */
    let path = "";
    if (boss) {
      path = getBossGifPath(bossRef.current.get(id) ?? BOSSES.None);
    } else {
      if (ban) {
        path = getCharacterBanPath(charRef.current.get(id) ?? CHARACTERS.None);
      } else {
        path = getCharacterGifPath(charRef.current.get(id) ?? CHARACTERS.None);
      }
    }
    setLink(path);
    setAlertOpen(true);
    setTimeout(() => {
      setAlertOpen(false);
    }, 5000); // shows for 5 seconds, can be changed
  };

  const addSelectedBosses = () => {
    let newBosses: number[] = [];
    identity.bosses
      .filter((boss) => boss != -1)
      .forEach((boss) => newBosses.push(boss));
    // add fearless bosses too
    if (identity.fearless) {
      identity.fearlessBosses
        .filter((boss) => boss != -1)
        .forEach((boss) => newBosses.push(boss));
    }
    return newBosses;
  }

  const addSelectedExtraBans = () => {
    let newCharacters: number[] = [];
    identity.extrabans
      .filter((ban) => ban > -1)
      .forEach((ban) => newCharacters.push(ban));
    return newCharacters;
  }
  
  const addSelectedBans = () => {
    let newCharacters: number[] = [];
    identity.bans
      .filter((ban) => ban > -1)
      .forEach((ban) => newCharacters.push(ban));
    return newCharacters;
  }
  
  const addSelectedPicks = (team: 1 | 2) => {
    let newCharacters: number[] = [];
    identity[`pickst${team}`]
      .filter((pick) => pick != -1)
      .forEach((pick) => newCharacters.push(pick));
    return newCharacters;
  }

  /**
   * Updates the selected ref objects to highlight grayscale objects.
   * @param {number} option the choice of what to add to selected, default is 6 (all). 1 is bosses, 2 is extra bans, 3 is bans, 4 and 5 are team 1 and team 2 picks respective
   */
  const updateSelected = (option: number = 6) => {
    // option 1: update boss
    switch(option){
      case 1: {
        let newBosses: number[] = addSelectedBosses();
        if (!newBosses.every((val, i) => val == selectedBosses[i])) {
          dispatch(overrideBoss(newBosses));
        }
        break;
      }
      case 2: {
        let newCharacters: number[] = addSelectedExtraBans();
        if(!newCharacters.every((val, i) => val == selectedExtraBans[i])){
          dispatch(overrideCharacter({type: "extraBans", characters: newCharacters}));
        }
        break;
      }
      case 3: {
        let newCharacters: number[] = addSelectedBans();
        if(!newCharacters.every((val, i) => val == selectedBans[i])){
          dispatch(overrideCharacter({type: "bans", characters: newCharacters}));
        }
        break;
      }
      case 4: {
        let newCharacters: number[] = addSelectedPicks(1);
        if(!newCharacters.every((val, i) => val == selectedPicksT1[i])){
          dispatch(overrideCharacter({type: "picksT1", characters: newCharacters}));
        }
        break;
      }
      case 5: {
        let newCharacters: number[] = addSelectedPicks(2);
        if(!newCharacters.every((val, i) => val == selectedPicksT2[i])){
          dispatch(overrideCharacter({type: "picksT2", characters: newCharacters}));
        }
        break;
      }
      case 6: {
        // override everything, just in case
        let bosses: number[] = addSelectedBosses();
        let extraBans: number[] = addSelectedExtraBans();
        let bans: number[] = addSelectedBans();
        let picksT1: number[] = addSelectedPicks(1);
        let picksT2: number[] = addSelectedPicks(2);

        console.log("overriding everything");
        dispatch(overrideBoss(bosses));
        dispatch(overrideAllCharacters({extraBans: extraBans, bans: bans, picksT1: picksT1, picksT2: picksT2}));
        break;
      }
    }
    // do the same for newCharacters
  }
  const updateSelectedDirect = (id: number, option: number) => {
    // option 1: update boss
    switch(option){
      case 1: {
        dispatch(selectBoss(id));
        break;
      }
      case 2: {
        dispatch(selectExtraBan(id));
        break;
      }
      case 3: {
        dispatch(selectBan(id));
        break;
      }
      case 4: {
        dispatch(selectPickT1(id));
        break;
      }
      case 5: {
        dispatch(selectPickT2(id));
        break;
      }
    }
  };
  const setupSocket = () => {
    if (socket.current.readyState == 1) {
      console.log("setting up socket");
      socket.current.send(
        JSON.stringify({
          type: "get",
          id: props.id,
        })
      ); // should work if first connection is to here
      socket.current.send(
        JSON.stringify({
          type: "latest",
          id: props.id,
        })
      );
    }
    else{
      console.log("waiting on socket");
    }
  };
  // arguably the most important method of the code
  
  const handleSocketMessage = (event: MessageEvent) => {
    let data: SocketBanMessage | SocketBossMessage | SocketConnectedMessage | SocketDNDMessage | SocketLatestMessage |
    SocketMessageWithGame | SocketPauseResumeMessage | SocketPickMessage | SocketOverwriteMessage |
    SocketPlayerNameMessage | SocketPhaseMessage | SocketTeamNameMessage | SocketTurnMessage = JSON.parse(event.data);
    console.log(data)
    if (data.id != props.id) {
      return; // do nothing if game does not match
    } // even if i go back, props.id does not exist, so this will return true and thereby nothing will happen
    if (data.message.toLowerCase() == "failure") {
      console.log(data);
      alert(data.error);
      return;
    }
    if (data.type != "turn" && data.type != "game" && data.type != "latest" && totalTime != TIMER) {
      setTotalTime(TIMER);
    }
    // console.log("data.type: " + data.type);
    switch (data.type) {
      case "create": {
        let newData = data as SocketMessageWithGame;
        dispatch(addGame(newData.game as GameWebInterface));
        break;
      }
      case "get": {
        let newData = data as SocketMessageWithGame;
        dispatch(addGame(newData.game as GameInterface));
        // updateIdentity(data.game);
        // updateTurn(data.game.turn);
        if(newData.game.totalBans == 6){
          setBanInfo([0, 3, 6]);
        }
        else{
          setBanInfo([1, 4, 8]);;
        }
        // if timer inactive then set timer
        if (newData.time != -1) {
          // data.time is -1 when game is not happening
          // make timer visible
          // console.log("setting tiomter");
          setTotalTime(newData.time * 1000);
          updateTimer(true, false);
        }
        /*
        dispatch(overrideBoss(newData.game.bosses.filter((boss) => boss > -1)));
        dispatch(
          overrideAllCharacters({
            extraBans: newData.game.extrabans.filter((ban) => ban > -1),
            bans: newData.game.bans.filter((ban) => ban > -1),
            picks: [
              ...newData.game.pickst1.filter((pick) => pick > -1),
              ...newData.game.pickst2.filter((pick) => pick > -1),
            ],
          })
        );
        */
          // updateSelected(6);
        // set the turn too
        if (canPause && newData.paused) {
          // console.log("must pause");
          // game is not paused, on server end it is paused
          setTimeout(() => {
            pauseDraft();
          }, 100);
        } else if (!canPause && !newData.paused) {
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
        let newData = data as SocketTurnMessage;
        dispatch(setTurn(newData.turn))
        if (newData.timer != -1 && localStorage.getItem("timer") === "false") {
          setTotalTime(newData.timer * 1000);
          updateTimer(true, false);
        }
        if (canPause && newData.paused) {
          // game is not paused, on server end it is paused
          setTimeout(() => {
            pauseDraft();
          }, 100);
        } else if (!canPause && !newData.paused) {
          // game is paused, server end is resumed
          setTimeout(() => {
            resumeDraft();
          }, 100);
        }
        // check for pause here too
        break;
      }
      case "boss": {
        let newData = data as SocketBossMessage;
        updateTimer(true, true);
        // handle this
        dispatch(addBoss({
          boss: newData.boss,
          long: newData.long,
          replaceIndex: -1,
          team: newData.team,
          nextTeam: newData.nextTeam
        }));
        showSelectionAlert(newData.boss, true, false);
        break;
      }
      case "complete": {
        break; // do nothing
      }
      case "DND": {
        let newData = data as SocketDNDMessage;
        // utilize this choice in res
        dispatch(dragAndDrop({where: newData.where, original: newData.first, target: newData.second}));
        break;
      }
      // should only execute if extra ban setting is enabled
      case "extraban":
      case "ban": {
        let newData = data as SocketBanMessage;
        console.log("current ban");
        updateTimer(true, true);
        if(data.type == "extraban"){
          dispatch(addExtraBan({
            character: newData.ban,
            replaceIndex: -1,
            team: newData.nextTeam
          }))
        }
        else{
          dispatch(addCharacter({
            ban: true,
            character: newData.ban,
            replaceIndex: -1,
            team: newData.team,
            nextTeam: newData.nextTeam
          }));
        }
        // updateSelectedDirect(newData.ban, 2);
        showSelectionAlert(newData.ban, false, true);
        break;
      }
      case "pick": {
        let newData = data as SocketPickMessage;
        console.log("current pick");
        updateTimer(true, true);
        dispatch(addCharacter({
          ban: false,
          character: newData.pick,
          replaceIndex: -1,
          team: newData.team,
          nextTeam: newData.nextTeam
        }));
        // updateSelectedDirect(newData.pick, 3);
        showSelectionAlert(newData.pick, false, false);
        break;
      }
      case "pause":
        pauseDraft();
        break;
      case "resume":
        resumeDraft();
        break;
      case "names": {
        let newData = data as SocketPlayerNameMessage;
        const info: PlayerInfo = {
          names: newData.newNames,
          team: newData.team,
        }
        dispatch(addName(info));
        break;
      }
      case "teamname": {
        let newData = data as SocketTeamNameMessage;
        dispatch(addTeamName({
          team: newData.team,
          name: newData.teamName
        }));
        break;
      }
      case "overwrite": {
        // no more identity!!
        let newData = data as SocketOverwriteMessage;
        switch(newData.which){
          case "extrabans": {
            dispatch(addExtraBan({
              character: newData.replacement,
              replaceIndex: newData.original,
              team: 1
            }));
            // timeout for 0.05s?
            break;
          }
          case "ban": {
            dispatch(addCharacter({
              ban: true,
              character: newData.replacement,
              replaceIndex: newData.original,
              team: 1,
              nextTeam: 1
            }));
            break;
          }
          case "bosses": {
            dispatch(addBoss({
              boss: newData.replacement,
              long: newData.long ?? false,
              replaceIndex: newData.original,
              team: 1,
              nextTeam: 1
            }));
            break;
          }
          case "pickst1":
          case "pickst2": {
            dispatch(addCharacter({
              ban: false,
              character: newData.replacement,
              replaceIndex: newData.original,
              team: newData.which == "pickst1" ? 1 : 2,
              nextTeam: 1
            }));
            break;
          }
        }
        break;
      }
      case "players": {
        let newData = data as SocketConnectedMessage;
        if (cookies.player.charAt(0) == "R") {
          let info = "";
          for (let i = 0; i < newData.playerStatus.length; i++) {
            if (i < 2) {
              info += `Player ${i + 1} has joined: ${newData.playerStatus[i]}\n`;
            } else {
              info += `Two or more refs have joined: ${newData.playerStatus[i]}\n`;
            }
          }
          alert(info);
        }
        break;
      }
      case "status": {
        // res = parseStatus(data);
        break;
      }
      case "phase": {
        let newData = data as SocketPhaseMessage;
        if (newData.newPhase == "boss") {
          updateTimer(true, true);
          if (cookies.player.charAt(0) != "S") {
            alert("Draft starts now!");
          }
        } else if (newData.newPhase == "ban" || newData.newPhase == "pick") {
          updateTimer(true, true);
        }
        dispatch(changePhase(newData.newPhase));
        break;
      }
      case "latest": {
        let newData = data as SocketLatestMessage;
        latestRef.current = [newData.boss, newData.character];
        break;
      }
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
    } else {
      console.log("cannot pause draft");
    }
  };
  const resumeDraft = () => {
    if (countdownRef.current != null) {
      countdownRef.current.getApi().start();
      setPause(true);
    }
  };
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
  const openChange = (team: number, name: string, original: number) => {
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
    let info = ["", "", "0", "0"];
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
    // also if it says none disable change maybe? since it might break the game (?)
    // add 15 to extra ban i guess?
    info[1] = name;
    info[2] = team.toString();
    info[3] = original.toString(); // original is an index
    setChangeInfo(info);
    setShowChanges(true);
  };

  const handleChange = (change: string, team: number) => {
    // console.log("change: " + change);
    setShowChanges(false);
    if (cookies.player.charAt(0) != "R") {
      // reject
      return;
    }
    let res = parseInt(change);
    if (isNaN(res)) {
      if (changeInfo[0] == "boss") {
        res = bossNameRef.current.get(change.toLowerCase()) ?? -5;
        if(BOSS_DETAIL[bossRef.current.get(bossNameRef.current.get(change.toLowerCase()) ?? -5) ?? BOSSES.None].type == BOSS_TYPE.Legend){
          // create a modal that asks if they are sure they want to add a local legend
          if(!window.confirm("Are you sure you want to add a local legend? Local legends cannot be picked in standard division.")){
            return;
          }
        }
        else if(identity.longBoss[team - 1] && BOSS_DETAIL[bossRef.current.get(bossNameRef.current.get(change.toLowerCase()) ?? -5) ?? BOSSES.None].type != BOSS_TYPE.Standard){
          if(!window.confirm("Are you sure you want to add another long boss? There is a limit of one long boss in standard division per (two in premier division).")){
            return;
          }
        }
      } else {
        res = charNameRef.current.get(change.toLowerCase()) ?? -5;
      }
    }
    if (res < 0) {
      // ask for proper input
      if (changeInfo[0] == "boss") {
        alert("The boss name specified is invalid!");
      } else {
        alert("The character name specified is invalid!");
      }
      return;
    }
    // check for max value once

    socket.current.send(
      JSON.stringify({
        type: "overwrite",
        id: props.id,
        team: team,
        which: changeInfo[0],
        original: parseInt(changeInfo[3]),
        replacement: res,
      })
    );
    // find the original and replace it
  };

  const handleDND = (event: DragEndEvent) => {
    if (cookies.player.charAt(0) != "R") {
      return;
    }
    const {active, over} = event;
    if (!active || !over) {
      return;
    }
    // cast because dnd kit can be string or number, must account for both
    let vals = [typeof active.id == "number" ? active.id : Number(active.id)];
    vals.push(typeof over.id == "number" ? over.id : Number(over.id));
    let info = {
      type: "dnd",
      id: props.id,
      where: dndRef.current,
      values: vals,
    };
    socket.current.send(JSON.stringify(info));
    dndRef.current = "boss";
  };
  const handleT1DND = (event: DragEndEvent) => {
    dndRef.current = "t1";
    handleDND(event);
  };
  const handleT2DND = (event: DragEndEvent) => {
    dndRef.current = "t2";
    handleDND(event);
  };

  // split the page into three parts, 25% / 50% / 25% (ish - grid takes cares of this)
  let bans = useAppSelector(totalBans) == 6
      ? [0, 2, 5, 1, 3, 4]
      : [0, 2, 4, 7, 1, 3, 5, 6];
  // console.log("ban info: "+banInfo);
  let timeOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const limit = identity.bosses.length ?? 0;
  // add pause, waiting, game over
  const smallSizeChoice = cookies.player.charAt(0) == "S" && isMediumOrBigger ? 3 : 2;
  const largeSizeChoice = cookies.player.charAt(0) == "S" && isMediumOrBigger ? 6 : 8;
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
          ? identity[turn == 1 ? "team1" : "team2"] + " 's turn! ID " + props.id
          : "enemy turn! ID " + props.id}
      </title>
      {identity == null ? (
        <p>your page is currently loading!</p>
      ) : (
        <Fragment>
          <Box sx={{ fontSize: gameTextSize }}>
            <Grid container spacing={1} sx={{ marginTop: 1 }}>
              <Grid size={smallSizeChoice}>
                <div
                  style={{ textAlign: "center" }}
                  onClick={() =>
                    updateTeamNames(prompt("enter a new name for team 1:"), 1)
                  }
                >
                  {typeof identity.team1 == undefined
                    ? "team 1 selections"
                    : identity.team1 + " picks"}
                </div>
              </Grid>
              <Grid container size={largeSizeChoice} columns={4}>
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
                  {identity.result == "progress" || identity.result == "finish"
                    ? null
                    : identity.result != "waiting"
                    ? "select a " + identity.result.toLowerCase()
                    : "waiting, id " + props.id}
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
              <Grid size={smallSizeChoice}>
                <div
                  style={{ textAlign: "center" }}
                  onClick={() =>
                    updateTeamNames(prompt("enter a new name for team 2:"), 2)
                  }
                >
                  {typeof identity.team2 == undefined
                    ? "team 2 selections"
                    : identity.team2 + " picks"}
                </div>
              </Grid>
              <Grid
                container
                direction="row"
                size={smallSizeChoice}
                maxHeight={{ xs: "80vh", sm: undefined }}
                columns={1}
              >
                <DndContext
                  onDragEnd={handleT1DND}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                >
                  {Array.from(Array(6)).map((_, ind) => {
                    return (
                      <Grid
                        container
                        size={1}
                        offset={0.01}
                        direction="row"
                        key={ind}
                        sx={{
                          justifyContent: isMediumOrBigger ? "center" : "left",
                        }}
                      >
                        {charRef.current != undefined
                          ? displayCharacter(
                              // change to work on bans too, again same cond only ref can change
                              charRef.current.get(identity.pickst1[ind]) ??
                                CHARACTERS.None,
                              true,
                              1,
                              ind,
                              openChange
                            )
                          : null}
                        {/* 
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
                                typeof identity.playerst1[ind / 2] ==
                                  "undefined"
                                ? "player " + ind / 2
                                : "  " + identity.playerst1[ind / 2]
                              : ""}
                          </Box>  
                            */}
                      </Grid>
                    );
                  })}
                </DndContext>
                {!isMediumOrBigger
                  ? bans.slice(0, banInfo[1]).map((ban) => {
                      return (
                        <Grid key={ban} offset={0.01} size={1}>
                          {charRef.current != undefined
                            ? displayCharacter(
                                charRef.current.get(identity.bans[ban]) ??
                                  CHARACTERS.None,
                                false,
                                1,
                                -1 * (ban + 1),
                                openChange
                              )
                            : null}
                        </Grid>
                      );
                    })
                  : undefined}
              </Grid>
              <Grid size={largeSizeChoice}>
                <div
                  ref={(el) => {
                    // borrowed code
                    if (!el) return;
                    let prevValue = JSON.stringify(el.getBoundingClientRect());
                    const handle = setInterval(() => {
                      let nextValue = JSON.stringify(
                        el.getBoundingClientRect()
                      );
                      if (nextValue === prevValue) {
                        clearInterval(handle);
                        localStorage.setItem(
                          "x",
                          `${el.getBoundingClientRect().x}`
                        );
                      } else {
                        prevValue = nextValue;
                      }
                    }, 100);
                  }}
                  style={
                    identity.result.toLowerCase() == "progress" ||
                    cookies.player.charAt(0) == "S"
                      ? { minWidth: 1080 }
                      : undefined
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
                          sendHover={sendHover}
                          inGame={true}
                          bonusInfo={[extraInfo]}
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
                          sendHover={sendHover}
                          inGame={true}
                          bonusInfo={[extraInfo]}
                        />
                      ) : null
                    ) : null}
                  </div>
                  <div>
                    {identity.result.toLowerCase() == "progress" ||
                    cookies.player.charAt(0) == "S" ? (
                      <p>thank you!</p>
                    ) : null}
                  </div>
                </div>
              </Grid>
              <Grid
                container
                direction="row"
                size={smallSizeChoice}
                columns={1}
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
                        direction="row"
                        size={1}
                        sx={{
                          justifyContent: isMediumOrBigger ? "center" : "end",
                        }}
                        key={ind}
                      >
                        {charRef.current != undefined
                          ? displayCharacter(
                              charRef.current.get(identity.pickst2[ind]) ??
                                CHARACTERS.None,
                              true,
                              2,
                              ind,
                              openChange
                            )
                          : null}
                        {/* 
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
                                ? identity.playerst2[ind / 2] == undefined // check on this to make sure it works
                                  ? "player " + ind / 2
                                  : identity.playerst2[ind / 2]
                                : ""}
                            </Box>
                          */}
                      </Grid>
                    );
                  })}
                </DndContext>
                {!isMediumOrBigger
                  ? bans.slice(banInfo[1], banInfo[2]).map((ban) => {
                      return (
                        <Grid
                          container
                          size={1}
                          sx={{ justifyContent: "flex-end" }}
                          key={ban}
                        >
                          {charRef.current != undefined
                            ? displayCharacter(
                                charRef.current.get(identity.bans[ban]) ??
                                  CHARACTERS.None,
                                false,
                                2,
                                -1 * (ban + 1),
                                openChange
                              )
                            : null}
                        </Grid>
                      );
                    })
                  : undefined}
              </Grid>
              <Grid
                container
                offset={2}
                size={largeSizeChoice}
                justifyContent={"center"}
                columns={{ xs: 2, sm: 3, md: 4 }}
              >
                {isMediumOrBigger && cookies.player.charAt(0) != "S" ? (
                  <Grid offset={1} marginTop={0} size={1}>
                    <Typography
                      textTransform="none"
                      fontSize={{ md: "0.8rem", lg: "0.95rem", xl: "1.1rem" }}
                    >
                      Currently hovered:{" "}
                      {identity.result == "boss" || identity.result == "waiting"
                        ? BOSS_DETAIL[
                            bossRef.current.get(hoverBoss) ?? BOSSES.None
                          ].displayName
                        : CHARACTER_INFO[
                            charRef.current.get(hoverCharacter) ??
                              CHARACTERS.None
                          ].displayName}
                    </Typography>
                  </Grid>
                ) : null}
                <Grid offset={{ xs: 0, sm: 1, md: 0 }} size={1}>
                  {cookies.player.charAt(0) == "R" &&
                  identity.result == "waiting" ? (
                    <Fragment>
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
                          backgroundColor: "#543834",
                          color: "white",
                        }}
                      >
                        <Typography textTransform="none">
                          check players
                        </Typography>
                      </Button>
                    </Fragment>
                  ) : !isMediumOrBigger && cookies.player.charAt(0) != "S" ? (
                    <Typography
                      marginTop={1}
                      fontSize={{ xs: "0.55rem", sm: "0.8rem" }}
                    >
                      hovered:{" "}
                      {identity.result == "boss" || identity.result == "waiting"
                        ? BOSS_DETAIL[
                            bossRef.current.get(hoverBoss) ?? BOSSES.None
                          ].displayName
                        : CHARACTER_INFO[
                            charRef.current.get(hoverCharacter) ??
                              CHARACTERS.None
                          ].displayName}
                    </Typography>
                  ) : null}
                </Grid>
                <Grid size={1}>
                  <Fragment>
                    {cookies.player.charAt(0) == "R" &&
                    canPause &&
                    identity.result != "waiting" &&
                    identity.result != "progress" &&
                    identity.result != "finish" ? (
                      <Button
                        sx={{
                          backgroundColor: "#543834",
                          color: "white",
                        }}
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
                        <Typography textTransform="none">pause</Typography>
                      </Button>
                    ) : cookies.player.charAt(0) == "R" &&
                      identity.result != "waiting" &&
                      identity.result != "progress" &&
                      identity.result != "finish" ? (
                      <>
                        <Button
                          sx={{
                            backgroundColor: "#543834",
                            color: "white",
                          }}
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
                          <Typography textTransform="none">resume</Typography>
                        </Button>
                      </>
                    ) : cookies.player.charAt(0) == "1" ||
                      cookies.player.charAt(0) == "2" ? (
                      <Button
                        sx={{
                          backgroundColor: "#543834",
                          color: "black",
                        }}
                        fullWidth
                        disabled={
                          identity.result == "waiting" ||
                          identity.result == "progress" ||
                          identity.result == "finish" ||
                          turn.toString() != cookies.player.charAt(0)
                        }
                        onClick={() => {
                          console.log("button clicked");
                          sendSelection(
                            turn,
                            identity.result == "boss"
                              ? hoverBoss
                              : hoverCharacter,
                            identity.result
                          );
                        }}
                      >
                        <Typography textTransform="none">{`confirm ${identity.result.toLowerCase()}`}</Typography>
                      </Button>
                    ) : cookies.player.charAt(0) == "R" &&
                      identity.result == "waiting" ? (
                      <Button
                        sx={{
                          backgroundColor: "#543834",
                          color: "white",
                        }}
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
                        <Typography textTransform="none">start game</Typography>
                      </Button>
                    ) : null}
                  </Fragment>
                </Grid>
              </Grid>
              <Grid
                size={cookies.player.charAt(0) == "S" ? smallSizeChoice : 2}
              />
              <Grid
                container
                sx={{ justifyContent: "center" }}
                size={smallSizeChoice}
              >
                {isMediumOrBigger ? (
                  bans.slice(0, banInfo[1]).map((ban) => {
                    return (
                      <div key={ban}>
                        {charRef.current != undefined
                          ? displayCharacter(
                              charRef.current.get(identity.bans[ban]) ??
                                CHARACTERS.None,
                              false,
                              1,
                              -1 * (ban + 1),
                              openChange
                            )
                          : null}
                      </div>
                    );
                  })
                ) : identity.extrabanst1 > 0 ? (
                  <ExtraBanDisplay
                    charInfo={charRef.current}
                    gridSize={smallSizeChoice}
                    openChange={openChange}
                    team={1}
                  />
                ) : null}
              </Grid>
              <Grid
                container
                size={largeSizeChoice}
                spacing={1}
                columns={identity.bosses.length}
              >
                <DndContext
                  onDragEnd={handleDND}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToHorizontalAxis]}
                >
                  {timeOrder.slice(0, limit).map((time) => {
                    return (
                      <Grid
                        container
                        sx={{ justifyContent: "center" }}
                        size={1}
                        key={time}
                      >
                        {bossRef.current != undefined
                          ? displayBoss(
                              bossRef.current.get(identity.bosses[time]) ??
                                BOSSES.None,
                              time,
                              openChange
                            )
                          : null}
                      </Grid>
                    );
                  })}
                </DndContext>
              </Grid>
              {isMediumOrBigger ? (
                <Grid
                  container
                  size={smallSizeChoice}
                  sx={{justifyContent: "center"}}
                  spacing={1}
                >
                  {bans.slice(banInfo[1], banInfo[2]).map((ban) => {
                    return (
                      <Fragment key={ban}>
                        {charRef.current != undefined
                          ? displayCharacter(
                              charRef.current.get(identity.bans[ban]) ??
                                CHARACTERS.None,
                              false,
                              2,
                              -1 * (ban + 1),
                              openChange
                            )
                          : null}
                      </Fragment>
                    );
                  })}
                </Grid>
              ) : identity.extrabanst2 > 0 ? (
                <ExtraBanDisplay
                  charInfo={charRef.current}
                  gridSize={smallSizeChoice}
                  openChange={openChange}
                  team={2}
                />
              ) : null}

              {isMediumOrBigger && identity.extrabanst1 > 0 ? (
                <ExtraBanDisplay
                  charInfo={charRef.current}
                  gridSize={smallSizeChoice}
                  openChange={openChange}
                  team={1}
                />
              ) : null}
              {/* need to decide proper offset for the below grid - either 10 or 8 depending on if t1 has extra bans */}

              {isMediumOrBigger && identity.extrabanst2 > 0 ? (
                <ExtraBanDisplay
                  charInfo={charRef.current}
                  gridSize={smallSizeChoice}
                  openChange={openChange}
                  team={2}
                />
              ) : null}
            </Grid>
          </Box>

          <Typography sx={{ fontSize: gameTextSize, marginLeft: 1 }}>
            {`playing game id`} <b>{`${props.id}!`}</b>
          </Typography>
          <Button
            style={{ backgroundColor: "#543834", color: "white" }}
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
            team={parseInt(changeInfo[2])}
          />
          <GifPlay link={alertLink} isOpen={alertOpen} />
        </Fragment>
      )}
    </div>
  );
}

export default Game;