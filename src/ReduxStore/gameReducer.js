const initialState = { // all game information
  _id: -1,
  playerst1: ["player1", "player2", "player3"],
  playerst2: ["player4", "player5", "player6"],
  division: "Advanced",
  result: "setup",
  bans: [],
  bosses: [],
  draft: true,
  result: "boss",
  connected: [0, 0, 0],
  team1: "Team 1 Name",
  team2: "Team 2 Name",
  turn: 1,
  longBoss: [false, false],
  timest1: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  timest2: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  statust1: ["X", "X", "X", "X", "X", "X", "X"],
  statust2: ["X", "X", "X", "X", "X", "X", "X"],
  pickst1: [],
  pickst2: []
};
export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    case "game/id":
        return {
            ...state,
            _id: action.payload
        }
    case "game/players":
        // check the payload for 
        switch(action.payload.team){
            case 1:
                return {
                    ...state,
                    playerst1: action.payload.players
                };
            case 2:
                return {
                    ...state,
                    playerst2: action.payload.players,
                };
            default:
                return state;
        }
    case "game/status":
        switch(action.payload.type){
            
        }
    default: 
        return state;
  }
}