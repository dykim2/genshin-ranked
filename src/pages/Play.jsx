import { useState, useEffect, useContext, Fragment, forwardRef, Slide } from "react";
// import './css/Playing.css';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemText, Modal } from "@mui/material";
import ActiveContext from "../contexts/ActiveContext.js";

// start implementing redux!

const gameInfo = () => JSON.stringify(sessionStorage.getItem("game")) || { connected: [0, 0, 0] };

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
  const refreshGames = () => {
    setRefresh(true);
    setTimeout(() => {setRefresh(false)}, 10000) // wait 10 seconds between refreshes 
  };
  useEffect( () => {
    sessionStorage.setItem("game", JSON.stringify(status));
  }, [status])
    const playGame = async(id) => {
      setCreating(false);
      setOpen(false);
      // call api to see if a player 1 / 2 / ref exists
      sessionStorage.removeItem("game");
      let info = await fetch(`https://rankedapi-late-cherry-618.fly.dev/gameAPI/find/${id}`)
      info = await info.json();
      setStatus(info[0]);
      sessionStorage.setItem("game", JSON.stringify(info[0]));
      // redirect to the new page (/play/id) - add to navigation
      setChoosing(true);
    }
    const close = () => {
      setOpen(false);
    }
    const join = () => {
      setOpen(true);
    }
    const navigate = (id) => { 
      console.log("hi");
      return navi(`/play/${id}`)
    }
    const choosePlayer = async(playerChoice, id) => {
      if(playerChoice.includes("Player ")){
        playerChoice = playerChoice.substring(playerChoice.length - 1)
      }
      if(playerChoice == "Spectator" && creating){
        alert("You cannot create a game as a spectator!")
        return
      }
      setReadying(true);
      // set the player in the API
      let valid = true;
      let bosses = await fetch(
        "https://rankedapi-late-cherry-618.fly.dev/bossAPI/all",
        {
          method: "GET",
        }
      );
      bosses = await bosses.json();
      sessionStorage.setItem("bosses", JSON.stringify(bosses[0]));
      if(playerChoice != "Spectator" && !creating){
        let res = await fetch(`https://rankedapi-late-cherry-618.fly.dev/gameAPI/players/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            player: ""+playerChoice,
          }),
        })
        let info = await res.json();
        if (res.status != 200) {
          valid = false;
          alert(info.message);
        }
      }
      else if(creating){
        let res = await fetch(
          `https://rankedapi-late-cherry-618.fly.dev/gameAPI/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              _id: -1,
              player: "" + playerChoice,
            }),
          }
        );
        sessionStorage.removeItem("game");
        res = await res.json();
        console.log("res");
        console.log(res);
        setStatus(res[0]);
        sessionStorage.setItem("game", JSON.stringify(res[0]))
        id = res[0]._id;
      }
      if(!valid){
        return; // don't go any further
      }
      sessionStorage.setItem("selected_bosses", []);
      sessionStorage.setItem("selected_characters", []);
      setCookie("player", ""+playerChoice+" game "+id);
      setChoosing(false);
      setReadying(false);
      navigate(id);
      window.location.reload();
    }
    const createGame = async() => {
      console.log("hi")
      // create the game here
      setCreating(true);
      // once created, connect the game to the websocket api to allow for picks and bans
      setChoosing(true);
    }
    const centerStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      whitespace: 'pre-line',
      flexDirection: "column",
      fontFamily: "Roboto Mono"
    };
    const limit = [1,1,3,-1];
    return (
      <div>
        {typeof cookies.player == "undefined" ? null : (
          <p style={{ fontSize: 20, color: "blue" }}>
            You are currently in the middle of a game.
          </p>
        )}
        <div style={centerStyle}>
          <h1 style={{ fontSize: 65 }}>Welcome to Genshin Ranked!</h1>
          <p style={{ fontSize: 50, marginBottom: 100 }}>
            Click to start a new game or join an existing one!
          </p>
          <Button
            variant="contained"
            sx={{ fontSize: 30 }}
            onClick={createGame}
          >
            New Game
          </Button>
          <Button variant="contained" sx={{ fontSize: 30 }} onClick={join}>
            Join existing game
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: 30 }}
            onClick={() => {
              removeCookie("player");
              forceRefresh();
            }}
          >
            Quit existing game
          </Button>
        </div>
        <Dialog
          open={open}
          onClose={close}
          scroll="paper"
          PaperProps={{ style: { color: "white", backgroundColor: "black" } }}
        >
          <DialogTitle>Current games:</DialogTitle>
          <DialogContent>
            <List sx={{ pt: 0 }}>
              {activeGames.map((game) => {
                return (
                  <ListItem disableGutters key={game._id}>
                    <ListItemButton
                      sx={{
                        backgroundColor: "blue",
                        maxWidth: "90px",
                        minWidth: "90px",
                      }}
                      onClick={async () => {
                        await playGame(game._id);
                      }}
                    >
                      {`ID: ${game._id}`}
                    </ListItemButton>
                    <ListItemText primary={`current status: ${game.result}`} />
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={async () => {
                refreshGames();
                let gameData = await fetch(
                  "https://rankedapi-late-cherry-618.fly.dev/gameAPI/active",
                  {
                    method: "GET",
                  }
                );
                gameData = await gameData.json();
                setActive(gameData[0].reverse());
              }}
              disabled={refreshing}
              sx={{ fontSize: 22, color: "red" }}
            >
              {refreshing ? "Please Wait" : "Refresh"}
            </Button>
            <Button onClick={close} sx={{ fontSize: 22, color: "blue" }}>
              Exit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={choosing}
          onClose={close}
          PaperProps={{ style: { color: "white", backgroundColor: "black" } }}
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
                  {["Player 1", "Player 2", "Ref", "Spectator"].map((player, index) => {
                    return (
                      <ListItem disableGutters key={player}>
                        <ListItemButton
                          onClick={() => choosePlayer(player, status._id)}
                          disabled={
                            typeof status.connected != "undefined" &&
                            status.connected[index] == limit[index]
                          }
                        >
                          {player}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </DialogContent>
              <DialogActions>
                <Button
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