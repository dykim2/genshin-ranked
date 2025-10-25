import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../app/withTypes";
import {RootState} from "../app/store";
/*
  _id: Number,
  bans:
  bossBans: 
  bosses: 
  connected:
  division: 
  extrabans: 
  extrabanst1: 
  extrabanst2:
  fearless:
  fearlessBosses: 
  hovered: 
  log: 
  longBoss:
  pickst1: 
  pickst2: 
  playerst1:
  playerst2:
  result: 
  team1: 
  team2: 
  totalBans:
  turn: 
*/
// dont save log locally

const api_list = [
  "https://rankedapi-late-cherry-618.fly.dev",
  "http://localhost:3001",
];
const api = api_list[0];

export interface GameInterface {
  _id: number;
  bans: number[];
  bossBans: number[];
  bosses: number[];
  connected: [number, number, number];
  division: "open" | "standard" | "premier";
  doBossBans: boolean;
  error: string | null;
  extrabans: number[]; //
  extrabanst1: number;
  extrabanst2: number;
  fearless: boolean;
  fearlessBosses: number[];
  longBoss: boolean[];
  pickst1: number[];
  pickst2: number[];
  playerst1: string[];
  playerst2: string[];
  result: string;
  team1: string;
  team2: string;
  totalBans: number;
  turn: number;
  status: "idle" | "pending" | "success" | "failed";
}

export interface GameWebInterface extends GameInterface {
  // the stuff used by the server not used locally
  bossCount: number,
  fearlessID: number,
  hovered: number[];
  initialBosses: number[],
  log: string;
  player: string;
}

export interface GameSettings {
  _id: number;
  bossBans: number[],
  bossCount: number;
  division: string;
  doBossBans: boolean;
  extrabanst1: number;
  extrabanst2: number;
  fearless: boolean;
  fearlessID: number;
  initialBosses: number[];
  player: string;
  totalBans: number;
}

export interface PlayerInfo {
  names: string[],
  team: number
}

type TeamInfo = "playerst1" | "playerst2";

export const getPlayerKey = (team: number): TeamInfo => {
  return team === 1 ? "playerst1" : team === 2 ? "playerst2" : "playerst1";
}

const initialState: GameInterface = {
  // all game information
  // add support for boss bans... after adding mobile support (surely)
  _id: -1,
  bans: [],
  bossBans: [],
  bosses: [],
  connected: [0, 0, 0],
  division: "standard",
  doBossBans: true,
  error: null,
  extrabans: [],
  extrabanst1: 0,
  extrabanst2: 0,
  fearless: false,
  fearlessBosses: [],
  longBoss: [false, false],
  pickst1: [],
  pickst2: [],
  playerst1: [],
  playerst2: [],
  result: "waiting",
  team1: "t1 name",
  team2: "t2 name",
  totalBans: 0,
  turn: 1,
  status: "idle"
};
// when obtaining a game, i can reset the game state
// maybe make a reducer for each?
export const getGame = createAppAsyncThunk(
  "getGame",
  async (payload: number) => {
    const response = await fetch(`${api}/gameAPI/find/${payload}`);
    if (response.status != 200) {
      alert("Something went wrong when obtaining the game");
      throw new Error("Unable to create a game at this time");
    }
    const game: GameWebInterface = await response.json();
    return game;
  }
);

export const buildGame = createAppAsyncThunk(
  "buildGame",
  async(payload: GameSettings) => {
    console.log("test build a game")
    const response = await fetch(`${api}/gameAPI/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (response.status != 200) {
      alert("Something went wrong when creating the game");
      throw new Error("Unable to create a game at this time");
    }
    const game: GameWebInterface = await response.json();
    return game;
  },
  {
    condition: (_, thunkAPI) => {
      const status = getGameSearchResult(thunkAPI.getState());
      return status == "idle";
    }
  }
);

export const changeConnected = createAppAsyncThunk(
  "changeConnected",
  async (payload: { id: number; playerChoice: string }) => {
    const { id, playerChoice } = payload;
    const response = await fetch(`${api}/gameAPI/players/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player: `${playerChoice}` }),
    });
    if (response.status != 200) {
      alert("Something went wrong when looking up connected players");
      throw new Error("Unable to lookup connected players at this time");
    }
    const bans: {
      message: string;
      totalBans: number;
    } = await response.json();
    return bans.totalBans;
  },
  {
    condition: (_, thunkAPI) => {
      const status = getGameSearchResult(thunkAPI.getState());
      return status == "idle";
    },
  }
);

export const getConnected = createAppAsyncThunk(
  "getConnected",
  async (payload: number) => {
    const response = await fetch(`${api}/gameAPI/connections/${payload}`);
    if (response.status != 200) {
      alert("Something went wrong when looking up connected players");
      throw new Error("Unable to lookup connected players at this time");
    }
    const players: {
      message: string,
      connected: [number, number, number]
    } = await response.json();
    return players.connected;
  }
);

export const getTotalBans = createAppAsyncThunk(
  "getTotalBans",
  async (payload: number) => {
    const response = await fetch(`${api}/gameAPI/bans/${payload}`);
    if(response.status != 200){
      alert("Something went wrong when looking up connected players");
      throw new Error("Unable to lookup connected players at this time");
    }
    const res: {
      message: string,
      totalBans: number
    } = await response.json();
    return res.totalBans;
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addGame: (state, action: PayloadAction<GameInterface>) => {
      Object.assign(state, action.payload);
    },
    addBoss: (
      // socket message types: boss
      state,
      action: PayloadAction<{
        boss: number,
        long: boolean,
        replaceIndex: number,
        team: number,
        nextTeam: number
      }>
    ) => {
      const {boss, long, replaceIndex, team, nextTeam} = action.payload;
      if (team != 1 && team != 2) return;
      if (replaceIndex != -1) {
        state.bosses[replaceIndex] = boss;
        // check if long
        if(long && !state.longBoss[team]){
          state.longBoss[team] = true;
        }
      } else {
        const emptyIndex = state.bosses.findIndex((b: number) => b == -1);
        // should never be -1 but just in case
        if (emptyIndex != -1) {
          state.bosses[emptyIndex] = boss;
        }
        if (emptyIndex == state.bosses.length - 1) {
          // trigger bans or extra bans
          // on start of game set status to extraban if extra bans 
          state.result = "ban";
          state.turn = 1;
        }
        else{
          state.turn = Math.abs(nextTeam);
        }
        // check for next team
      }
      // this could override the long boss problem so must fix
      if(long && !state.longBoss[team]){
        state.longBoss[team] = true;
      }
      // check for next boss
      // create a reducer question mark
      // this could also manage code elsewhere
    },
    addBossBan(
      state,
      action: PayloadAction<{
        boss: number,
        replaceIndex: number,
        team: number,
        nextTeam: number
      }>
    ){
      const {boss, replaceIndex, team, nextTeam} = action.payload;
      if(team != 1 && team != 2) return;
      if(replaceIndex != -1){
        state.bossBans[replaceIndex] = boss;
      } else {
        const existingIndex = state.bossBans.findIndex((ban: number) => ban == boss);
        if(existingIndex != -1 && boss >= 0){
          console.log("boss already exists in boss bans");
          // do nothing
          return;
        }
        const emptyIndex = state.bossBans.findIndex((ban: number) => ban == -1);
        if (emptyIndex != -1) {
          state.bossBans[emptyIndex] = boss;
          // last empty ban?
          if (emptyIndex == state.bossBans.length - 1) {
            state.turn = 1;
            state.result = "boss";
          }
          else{
            // what determines the new turn?
             // push ones and twos in order until both limits are hit, then chooses the corresponding index
            state.turn = Math.abs(nextTeam); // calculates next team
          }
        }
      }
    },
    addCharacter( // use selected team
      // socket message types: pick, ban, overwrite (just change replacementindex to not be -1)
      // does not directly handle extra bans but accounts for their existence
      state,
      action: PayloadAction<{
        ban: boolean,
        character: number,
        replaceIndex: number,
        team: number,
        nextTeam: number
      }>
    ) {
      const {ban, character, replaceIndex, team, nextTeam} = action.payload;
      console.log(action.payload);
      console.log("is the payload");
      if(team != 1 && team != 2) return;
      if(Math.abs(nextTeam) > 2) return;
      const which: "bans" | "pickst1" | "pickst2" = ban ? "bans" : `pickst${team}`;
      if (replaceIndex != -1) {
        state[which][replaceIndex] = character;
      } else {
        const emptyIndex = state[which].findIndex((ban: number) => ban == -1);
        if (emptyIndex != -1) {
          if(nextTeam < 0){
            console.log("next team is negative");
            console.log("current empty index: "+emptyIndex)
          }
          state[which][emptyIndex] = character;
          if(character < 0){
            console.log("there is a negative character with index "+character)
          }
          if (team == 2 && nextTeam == -2) {
            state.result = "ban";
          }
          else if (ban && emptyIndex == state[which].length - 3) {
            // first set of bans over
            // change phase to pick
            state.result = "pick";
          }
          else if (emptyIndex == state[which].length - 1) {
            if (ban) {
              // all bans over, go to pick phase but with t2 going
              state.result = "pick";
            } else if (which == "pickst1") {
              state.result = "progress";
            }
          }
          state.turn = Math.abs(nextTeam);
        }
      }
    },
    addExtraBan: (
      state,
      action: PayloadAction<{
        character: number;
        replaceIndex: number;
        team: number;
      }>
    ) => {
      // socket message types: extraban
      const {character, replaceIndex, team} = action.payload;
      if (Math.abs(team) != 1 && Math.abs(team) != 2) return;
      if (replaceIndex != -1) {
        state.extrabans[replaceIndex] = character;
      } else {
        // check if character exists already
        const existingIndex = state.extrabans.findIndex((ban: number) => ban == character);
        if (existingIndex != -1 && character >= 0) {
          console.log("character already exists in extra bans");
          // do nothing
          return;
        }
        const emptyIndex = state.extrabans.findIndex((ban: number) => ban == -1);
        if (emptyIndex != -1) {
          state.extrabans[emptyIndex] = character;
          // last empty ban?
          if (emptyIndex == state.extrabans.length - 1) {
            state.turn = 1;
            if(state.doBossBans){
              state.result = "bossban";
            }
            else{
              state.result = "boss";
            } 
          }
          else{
            // what determines the new turn?
             // push ones and twos in order until both limits are hit, then chooses the corresponding index
            state.turn = team; // calculates next team
          }
        }
      }
    },
    addName(state, action: PayloadAction<PlayerInfo>) {
      // socket message types: names
      let {names, team} = action.payload;
      if (team != 1 && team != 2) return;
      state[`playerst${team}`] = names;
    },
    addTeamName(state, action: PayloadAction<{team: number, name: string}>) {
      // socket message types: teamname
      const {team, name} = action.payload;
      if (team != 1 && team != 2) return;
      state[`team${team}`] = name;
    },
    changePhase(state, action: PayloadAction<string>) {
      let phases = [
        "waiting",
        "boss",
        "bossban",
        "extraban",
        "ban",
        "pick",
        "progress",
        "finish",
      ];
      if (!phases.includes(action.payload.toLowerCase())) {
        return;
      }
      if(action.payload.toLowerCase() == "extraban" && state.extrabans.length == 0){
        return;
      }
      else if(action.payload.toLowerCase() == "bossban" && state.doBossBans == false){
        return;
      }
      else if(action.payload.toLowerCase() == "extraban" && state.extrabans.length > 0){
        state.turn = state.extrabanst1 == 0 ? 2 : 1;
      }
      state.result = action.payload;
    },
    dragAndDrop(state, action: PayloadAction<{
      original: number, // these are provided as indices
      target: number,
      where: string // bosses, pickst1, pickst2
    }>) {
      const {original, target, where} = action.payload;
      if(where != "bosses" && where != "pickst1" && where != "pickst2") return;
      const temp = state[where][original];
      state[where][original] = state[where][target];
      state[where][target] = temp;
    },
    setBans(state, action: PayloadAction<number>) {
      state.totalBans = action.payload;
    },
    setTurn(state, action: PayloadAction<number>) {
      // socket message types: turn
      state.turn = action.payload;
    },
    removeGame(state) {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGame.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getGame.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.status = "idle";
      })
      .addCase(buildGame.pending, (state) => {
        state.status = "pending";
      })
      .addCase(buildGame.fulfilled, (state, action) => {
        state.status = "idle";
        Object.assign(state, action.payload);
      })
      .addCase(changeConnected.pending, (state) => {
        state.status = "pending";
      })
      .addCase(changeConnected.fulfilled, (state, action) => {
        state.status = "idle";
        state.totalBans = action.payload;
      })
      .addCase(getConnected.fulfilled, (state, action) => { 
        state.status = "idle";
        state.connected = [action.payload[0], action.payload[1], action.payload[2]];
      })
      .addCase(getTotalBans.fulfilled, (state, action) => {
        state.status = "idle";
        state.totalBans = action.payload;
      });
  }
});

export const gameInfo = (state: RootState) => state.game;
export const gameTurn = (state: RootState) => state.game.turn;
export const gameResult = (state: RootState) => state.game.result;
export const getGameSearchResult = (state: RootState) => state.game.status;
export const totalBans = (state: RootState) => state.game.totalBans;
export const extraBanCount = (state: RootState) => state.game.extrabans.length;
export const bossBansExist = (state: RootState) => state.game.bossBans.length > 0;

export default gameSlice;
export const {addGame, addBoss, addBossBan, addCharacter, addExtraBan, addName, addTeamName, changePhase, dragAndDrop, setBans, setTurn, removeGame} = gameSlice.actions;
/*
  what happens over the course of a draft? before, after, etc (SETTERS)
  - boss, ban, pick, etc
  - occasionally replace boss / ban / pick for another
  - occasionally drag and drop boss / pick
  - change player names
  - change team name
  - obtain game information
  - refresh game info
  - anything in handlesocket

  before a draft?
  - custom game settings but like
  - i can make a seperate slice for those
  
  (GETTERS)

  - pause game (this will be handled propbably outside the store because of the way the timer works)
  - hover (this needs nothing to be done on client end minus displaying the selection)
  - get game information
*/