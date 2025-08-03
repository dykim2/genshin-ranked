import { useState, useEffect, useContext, Fragment, useRef, Key } from "react";
// import './css/Playing.css';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, List, ListItem, ListItemButton, ListItemText, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import ActiveContext from "../contexts/ActiveContext.js";

// start implementing redux!

const gameInfo = () => {
  const info = sessionStorage.getItem("game");
  return info ? JSON.parse(info) : { connected: [0, 0, 0] };
};

export default function Play(){
  const [refreshing, setRefresh] = useState(false); // for a refresh games option
  const [activeGames, setActive] = useContext(ActiveContext);
  const [open, setOpen] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["player"]);
  const [, forceRefresh] = useState(); // refreshes the page
  const [status, setStatus] = useState(gameInfo()); // the game the player chooses
  const navi = useNavigate();
  const [creating, setCreating] = useState(false);
  const [readying, setReadying] = useState(false);
  const [options, setOptions] = useState(false);
  const [banMode, setBanMode] = useState("3+1");

  const [mode, setMode] = useState("standard");

  const [extraBans, setExtraBans] = useState("no one");
  const [bans, setBans] = useState([0, 0]);

  const [bonusParams, setParams] = useState([0, -2, -1, -1]);
  const [creatingBO2, setBO2] = useState([false, true]); // is it a bo2? is it game 1 or 2 of the bo2?
  // bo2 alwayshas fearless bosses i.e. cant pick same bosses 
  const [fearless, setFearless] = useState<boolean>(false);

  const latestBoss = useRef(null);
  const api_list = ["https://rankedapi-late-cherry-618.fly.dev", "http://localhost:3000"];
  const api = api_list[0]; // 0 for "https://rankedapi-late-cherry-618.fly.dev" or 1 for "http://localhost:3000"

  const refreshGames = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 10000); // wait 10 seconds between refreshes
  };
  const updateFields = (index: number, value: string, isBan: boolean) => {
    let newValue = -1;
    if (Number.isNaN(parseInt(value))) {
      newValue = 0;
    } else {
      newValue = parseInt(value);
    }
    if (isBan) {
      let newBans = [...bans];
      newBans[index - 1] = newValue;
      setBans(newBans);
    } else {
      // index is the corresponding array index
      // for extra bosses, between -2 and 4, if -2 that means 5 bosses; if 4 it means 11 bosses (why would you ever do that tho)
      let newParams = [...bonusParams];
      newParams[index] = newValue;
      setParams(newParams);
    }
  };

  useEffect(() => {
    sessionStorage.setItem("game", JSON.stringify(status));
  }, [status]);
  const playGame = async (id: number) => {
    setCreating(false);
    setOpen(false);
    // call api to see if a player 1 / 2 / ref exists
    sessionStorage.removeItem("game");
    let info = await fetch(`${api}/gameAPI/find/${id}`);
    info = await info.json();
    console.log(info);
    setStatus(info[0]);
    sessionStorage.setItem("game", JSON.stringify(info[0]));
    // redirect to the new page (/play/id) - add to navigation
    setChoosing(true);
  };
  const close = () => {
    setOpen(false);
  };
  const join = () => {
    setOpen(true);
  };
  const navigate = (id: number) => {
    return navi(`/play/${id}`);
  };
  const defaultInfo = {
    _id: -1,
    player: "1",
    extrabanst1: bans[0],
    extrabanst2: bans[1],
    totalBans: 8,
    bossCount: bonusParams[0],
    initialBosses: [bonusParams[1], bonusParams[2]],
    division: mode,
    fearless: fearless,
    fearlessID: fearless ? bonusParams[3] : -1,
    processing: false
  };
  const choosePlayer = async (playerChoice: string, id: number, info = defaultInfo) => {
    info.player = playerChoice;
    if (playerChoice == "Ref (Custom)") {
      info.player = "Ref";
      setOptions(true);
      return;
    }
    else if(playerChoice == "Ref (BO2 Game 1)"){
      info.player = "Ref";
      setBO2([false, false]);
      // go directly to setting up and forego asking for id
      // update bonus params
      await submitBO2();
      return;
    }
    else if(playerChoice == "Ref (BO2 Game 2)"){
      info.player = "Ref";
      setBO2([true, true]);
      return;
    }
    else if(playerChoice == "Ref (2 + 1 bans)"){
      info.player = "Ref";
      info.totalBans = 6;
    }
    if (playerChoice.includes("Player ")) {
      info.player = playerChoice.substring(playerChoice.length - 1);
      playerChoice = playerChoice.substring(playerChoice.length - 1);
    }
    if (playerChoice == "Spectator" && creating) {
      alert("You cannot create a game as a spectator!");
      return;
    }
    setReadying(true);
    // set the player in the API
    let valid = true;
    let bosses = await fetch(`${api}/bossAPI/all`, {
      method: "GET",
    });
    bosses = await bosses.json();
    sessionStorage.setItem("bosses", JSON.stringify(bosses[0]));
    if (playerChoice != "Spectator" && !creating) {
      let res = await fetch(`${api}/gameAPI/players/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player: "" + playerChoice,
        }),
      });
      let newInfo = await res.json();
      if (res.status != 200) {
        valid = false;
        alert(newInfo.message);
      }
    } else if (creating) {
      // combine the info sent to the API - this allows me to add custom settings
      let res = await fetch(`${api}/gameAPI/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      sessionStorage.removeItem("game");
      res = await res.json();
      setStatus(res[0]);
      sessionStorage.setItem("game", JSON.stringify(res[0]));
      if(res[0].totalBans == 6){
        localStorage.setItem("totalbans", "2+1");
      }
      else{
        localStorage.setItem("totalbans", "3+1");
      }
      id = res[0]._id;
    }
    if (!valid) {
      return; // don't go any further
    }
    sessionStorage.setItem("selected_bosses", JSON.stringify([]));
    sessionStorage.setItem("selected_characters", JSON.stringify([]));
    setCookie("player", "" + playerChoice + " game " + id);
    setCreating(false);
    setChoosing(false);
    setReadying(false);
    navigate(id);
    localStorage.setItem("character", "-1");
    localStorage.setItem("boss", "-1");
    if(creating){
      window.location.reload();
    }
  };
  const createGame = async () => {
    console.log("hi");
    // create the game here
    setCreating(true);
    // once created, connect the game to the websocket api to allow for picks and bans
    setChoosing(true);
  };
  const centerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "pre-line",
    flexDirection: "column",
    fontFamily: "Roboto Mono",
  };
  const submitBO2 = async () => {
    // assumes no initial bans
    setBO2([false, [...creatingBO2][1]]);
    if(bonusParams[3] < -1){
      alert("Please choose a valid game id for fearless bosses!");
      return;
    }
    let info = {
      _id: -1,
      player: "1",
      extrabanst1: 0,
      extrabanst2: 0,
      totalBans: 8,
      bossCount: -1,
      initialBosses: [-1, -1],
      division: "advanced",
      fearless: bonusParams[3] > -1,
      fearlessID: bonusParams[3] > -1 ? bonusParams[3] : -1,
      processing: false
    };
    await choosePlayer("Ref", -1, info);
  }

  const submitCustom = async () => {
    // playerChoice is always ref - ref must join and decide these
    // similar to create game, but adds the extra information to the stats
    // the chooseplayer stuff
    // gathers info then send it to chooseplayer
    // should only be enabled if creating is true anyways
    for (let i = 0; i < bans.length; i++) {
      if (bans[i] < 0 || bans[i] > 3) {
        alert("extra bans count is invalid!");
        return;
      }
    }
    if (bonusParams[0] < -2 || bonusParams[0] > 4) {
      alert("number of extra bosses is invalid!");
      return;
    }
    // ask server for latest boss
    if (latestBoss.current == -1 || latestBoss.current == undefined) {
      let response = await fetch(`${api}/bossAPI/latest`);
      let latest = await response.json();
      latestBoss.current = latest.latest;
    }
    for (let i = 0; i < 2; i++) {
      if (
        bonusParams[i + 1] < -2 ||
        latestBoss.current == null ||
        bonusParams[i + 1] > latestBoss.current
      ) {
        alert(
          "invalid boss chosen! visit the bosses page to view all boss ids."
        );
        return;
      }
    }
    setOptions(false);
    let info = {
      _id: -1,
      player: "1",
      extrabanst1: bans[0],
      extrabanst2: bans[1],
      totalBans: banMode == "2+1" ? 6 : 8,
      bossCount: bonusParams[0],
      initialBosses: [bonusParams[1], bonusParams[2]],
      division: mode,
      fearless: fearless,
      fearlessID: fearless ? bonusParams[3] : -1,
      processing: false,
    };
    await choosePlayer("Ref", -1, info);

    /* dialog for extra options for a ref 
      The options:
      1. team gets extra bans - a series of radio buttons
      1.1. if a team gets extra bans, are they limited to support bans?

      2. custom number of bosses - team 1 will always get the extra pick

      3. preset first boss or make no preset (drake or a set boss or nothing)

      4. premier mode

      5. fearless bosses (no picking the same bosses as a previous game)
    */
  };
  const limit = [1, 1, 3, -1, -1]; // ref (custom) is meant to only work for creating games
  return (
    <div>
      {typeof cookies.player == "undefined" ? null : (
        <p style={{ fontSize: 20, color: "white" }}>
          You are currently in the middle of a game.
        </p>
      )}
      <div style={centerStyle as React.CSSProperties}>
        <h1 style={{ fontSize: 65 }}>Welcome to Genshin Ranked!</h1>
        <p style={{ fontSize: 50, marginBottom: 100 }}>
          Click to start a new game or join an existing one!
        </p>
        <Button
          variant="contained"
          sx={{
            fontSize: 30,
            marginBottom: 3,
            minWidth: 400,
            fontFamily: "Roboto Mono",
          }}
          onClick={createGame}
        >
          New Game
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: 30,
            marginBottom: 3,
            minWidth: 400,
            fontFamily: "Roboto Mono",
          }}
          onClick={join}
        >
          Join existing game
        </Button>
        <Button
          variant="contained"
          sx={{
            fontSize: 30,
            marginBottom: 3,
            minWidth: 400,
            fontFamily: "Roboto Mono",
          }}
          onClick={() => {
            removeCookie("player");
            forceRefresh(undefined);
          }}
        >
          Quit existing game
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={close}
        scroll="paper"
        slotProps={{
          paper: { style: { color: "white", backgroundColor: "#73584b" } },
        }}
      >
        <DialogTitle>select a game by its id:</DialogTitle>
        <DialogContent>
          <List sx={{ pt: 0 }}>
            {activeGames.map((game: { _id: number; result: string }) => {
              return (
                <ListItem disableGutters key={game._id}>
                  <ListItemButton
                    sx={{
                      backgroundColor: "#73584b",
                      border: "2px solid red",
                      maxWidth: "110px",
                      minWidth: "110px",
                    }}
                    onClick={async () => {
                      await playGame(game._id);
                    }}
                  >
                    {`ID: ${game._id}`}
                  </ListItemButton>
                  <ListItemText primary={`status: ${game.result}`} />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              refreshGames();
              let gameData = await fetch(`${api}/gameAPI/active`, {
                method: "GET",
              });
              gameData = await gameData.json();
              setActive(gameData[0]);
            }}
            disabled={refreshing}
            sx={{ fontSize: 22, color: "red" }}
          >
            {refreshing ? "Please Wait" : "Refresh"}
          </Button>
          <Button onClick={close} sx={{ fontSize: 22, color: "yellow" }}>
            Exit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={choosing}
        onClose={close}
        slotProps={{
          paper: { style: { color: "black", backgroundColor: "#73584b" } },
        }}
      >
        <DialogTitle>
          {readying
            ? "Loading your game... You will be automatically redirected!"
            : "Choose your player:"}
        </DialogTitle>
        {readying ? null : (
          <Fragment>
            <DialogContent>
              <br />
              <br />
              <List sx={{ pt: 0 }}>
                {[
                  "Player 1",
                  "Player 2",
                  "Ref",
                  "Ref (BO2 Game 1)",
                  "Ref (BO2 Game 2)",
                  "Ref (2 + 1 bans)",
                  "Ref (Custom)",
                  "Spectator",
                ].map((player, index) => {
                  return creating ||
                    (!creating && !player.includes("Ref (")) ? (
                    <ListItem disableGutters key={player}>
                      <ListItemButton
                        onClick={() => choosePlayer(player, status._id)}
                        disabled={
                          (player == "Spectator" && creating) ||
                          player == "Refe (Custom)" || // if i want to disable custom ref game i can do this in future (typo is intended)
                          (typeof status.connected != "undefined" &&
                            status.connected[index] >= limit[index])
                        }
                      >
                        {player}
                      </ListItemButton>
                    </ListItem>
                  ) : null;
                })}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                sx={{ color: "yellow" }}
                onClick={() => {
                  setChoosing(false); // stop choosing and remove game information
                  setStatus({ connected: [0, 0, 0] }); // back to default
                  sessionStorage.removeItem("game");
                }}
              >
                Exit
              </Button>
            </DialogActions>
          </Fragment>
        )}
      </Dialog>
      <Dialog
        open={options}
        onClose={() => setOptions(false)}
        slotProps={{
          paper: { style: { color: "black", backgroundColor: "#46bdc6" } },
        }}
      >
        <DialogTitle>
          <Typography fontWeight="bold">bonus ref options</Typography>
        </DialogTitle>
        {/* dialog for extra options for a ref 
            The options:
            1. team gets extra bans - a series of radio buttons
            1.1. if a team gets extra bans, are they limited to support bans?

            2. custom number of bosses - team 1 will always get the extra pick

            3. preset first boss or make no preset (drake or a set boss or nothing)

            4. premier mode

            5. fearless bosses (no picking the same bosses as a previous game)
          */}
        <DialogContent>
          <Typography>division</Typography>
          <FormControl>
            <RadioGroup
              row
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <FormControlLabel
                value={"standard"}
                control={<Radio />}
                label={"standard"}
              />
              <FormControlLabel
                value={"premier"}
                control={<Radio />}
                label={"premier"}
              />
            </RadioGroup>
          </FormControl>
          <Typography>standard ban count</Typography>
          <FormControl>
            <RadioGroup
              row
              value={banMode}
              onChange={(event) => setBanMode(event.target.value)}
            >
              <FormControlLabel
                value={"2+1"}
                control={<Radio />}
                label={"2 + 1 bans"}
              />
              <FormControlLabel
                value={"3+1"}
                control={<Radio />}
                label={"3 + 1 bans"}
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <Typography>who gets extra bans?</Typography>
            <RadioGroup
              sx={{ color: "black" }}
              name="extra-bans-group"
              row
              value={extraBans}
              onChange={(event) => {
                setExtraBans(event.target.value);
              }}
            >
              <FormControlLabel
                value="team 1"
                control={<Radio />}
                label="team 1"
              />
              <FormControlLabel
                value="team 2"
                control={<Radio />}
                label="team 2"
              />
              <FormControlLabel value="both" control={<Radio />} label="both" />
              <FormControlLabel
                value="no one"
                control={<Radio />}
                label="no one"
              />
            </RadioGroup>
          </FormControl>
          {extraBans == "team 1" || extraBans == "both" ? (
            <TextField
              helperText="Extra bans are limited to at most 2!"
              label="Team 1's extra ban count"
              variant="outlined"
              autoFocus
              defaultValue={bans[0]}
              onChange={(e) => updateFields(1, e.target.value, true)}
              error={bans[0] > 2 || bans[0] < 0}
            />
          ) : null}
          {extraBans == "team 2" || extraBans == "both" ? (
            <TextField
              helperText="Extra bans are limited to at most 2!"
              label="Team 2's extra ban count"
              variant="outlined"
              defaultValue={bans[1]}
              onChange={(e) => updateFields(2, e.target.value, true)}
              error={bans[1] > 2 || bans[1] < 0}
            />
          ) : null}
          <br />
          {/* remove support bans exclusivity for now */}
          {/*<Typography>are the extra bans for supports only?</Typography>
          <Typography textTransform="none" fontSize="13px">
            support characters include kazuha, xilonen, furina, and nahida.
          </Typography>
          <FormControl>
            <RadioGroup
              row
              value={supportBans}
              onChange={(event) => setSupportBans(event.target.value)}
            >
              <FormControlLabel
                value={"true"}
                control={<Radio />}
                label={"yes"}
              />
              <FormControlLabel
                value={"false"}
                control={<Radio />}
                label={"no"}
              />
            </RadioGroup>
          </FormControl>*/}
          <Typography>how many extra bosses?</Typography>
          <Typography textTransform="none" fontSize="13px">
            the default number of bosses is 7. the minimum is 5 and the maximum
            is 11.
          </Typography>
          <br />
          <TextField
            helperText="Choose between 2 less to 4 extra bosses!"
            label="How many extra bosses?"
            variant="outlined"
            defaultValue={bonusParams[0]}
            error={bonusParams[0] < -2 || bonusParams[0] > 4}
            onChange={(e) => updateFields(0, e.target.value, false)}
          />
          <Typography>choose default bosses:</Typography>
          <Typography textTransform="none" fontSize="13px">
            Enter the id of the boss. If -1. it assumes no default boss. If -2
            (for the first boss only), assumes it is drake (the default boss).
          </Typography>
          <br />
          <TextField
            helperText="Provide the id of the boss."
            label="first boss id"
            variant="outlined"
            defaultValue={bonusParams[1]}
            error={bonusParams[1] < -2}
            onChange={(e) => updateFields(1, e.target.value, false)}
          />
          <br />
          <TextField
            helperText="Provide the id of the boss."
            label="second boss id"
            variant="outlined"
            defaultValue={bonusParams[2]}
            error={bonusParams[2] < -1}
            onChange={(e) => updateFields(2, e.target.value, false)}
          />

          <Typography textTransform="none">fearless bosses?</Typography>
          <Typography textTransform="none" fontSize="13px">
            enabling fearless bosses with a game id means the bosses from said
            game id cannot be directly picked in this game.
          </Typography>
          <FormControl>
            <RadioGroup
              row
              value={fearless}
              onChange={(event) =>
                setFearless(event.target.value === "false" ? false : true)
              }
            >
              <FormControlLabel
                value={"true"}
                control={<Radio />}
                label={"yes"}
              />
              <FormControlLabel
                value={"false"}
                control={<Radio />}
                label={"no"}
              />
            </RadioGroup>
          </FormControl>
          <br />
          {fearless ? (
            <TextField
              helperText="the id of the game you want bosses from"
              label="game id"
              variant="outlined"
              defaultValue={bonusParams[3]}
              error={bonusParams[3] < 0}
              onChange={(e) => {
                updateFields(3, e.target.value, false);
              }}
            ></TextField>
          ) : null}

          {/* for the id of fearless boss - game must be either in the "progress" or the "finish" state */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => choosePlayer("Ref", status._id)}>
            <Typography textTransform="none" fontWeight="bold">
              {`default standard game`}
            </Typography>
          </Button>
          <Button
            onClick={async () => {
              submitCustom();
            }}
          >
            <Typography textTransform="none" fontWeight="bold">
              {`create ${mode} game`}
            </Typography>
          </Button>
          <Button onClick={() => setOptions(false)}>
            <Typography textTransform="none" fontWeight="bold">
              Cancel
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={creatingBO2[0]}
        onClose={() => {
          setBO2([false, [...creatingBO2][1]]);
        }}
        slotProps={{
          paper: { style: { color: "black", backgroundColor: "#46bdc6" } },
        }}
      >
        <DialogTitle>
          <Typography textTransform="none">
            Insert the id of game one, or -1 if this is game one.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            helperText="the id of the game you want bosses from, or -1 for no fearless bosses"
            label="game id"
            variant="outlined"
            defaultValue={bonusParams[3]}
            error={bonusParams[3] < -1}
            onChange={(e) => {
              updateFields(3, e.target.value, false);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitBO2}>
            <Typography textTransform="none" fontWeight="bold">
              Create BO2
            </Typography>
          </Button>
          <Button onClick={() => setBO2([false, [...creatingBO2][1]])}>
            <Typography textTransform="none" fontWeight="bold">
              Cancel
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}



/*
 2 scenarios
 1) user has a full game, wants to play. Click on a "Play" button. 
 2) Ref creates game and invites other ref. Player goes to website, refreshes for available games.
 3) One person from each team joins as players, others spectate. This will be directly limited. 
 4) Once everyone has joined (others can join whenever) and ref starts game, prep phase begins.
 5) After prep phase is over, team 1 chooses boss, team 2 chooses boss, etc, etc. 
 6) After pick/ban is over, players become spectators (game phase variable will exist). 
 7) Once times are input, and game is over, retry time is added and ref declares game to be over.



 Implementing scenarios
 1) Implement big ol play button.
 2) Add a section to the API - current games. It uses the same model as games, but represents a game in progress that can be joined.
 3) API calls will be used



*/