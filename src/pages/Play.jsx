import { useState, useEffect, useContext } from "react";
import './css/Playing.css';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Modal from "react-modal";
import ActiveContext from "../contexts/ActiveContext";
/*
    notes:
    1) I need to be able to redirect the user to a page of my choosing. 
    2) Once I redirect the user, I can set up something to choose a player 1 and player 2.
    3) I can use the API I made to add an extra call.
    4) If I do add the API, then I would have to add a call to it. Or alternatively I could create a custom link.
    5) If I do create a custom link, that solves a lot of the hassle. It would be like /player2 or something, would be updated in the backend as "busy" and I would have up to 10.
    6) This would i think haved to be randomized, kind of, or just set as a default link, instead of the not found page. 
    7) 


    Gonna try to use browser cookies - this should solve the problem of "am i player 1 or 2?". This does not answer one key question: how can i update 
*/

const gameInfo = () => JSON.stringify(sessionStorage.getItem("game")) || { connected: [0, 0, 0] };

export default function Play(){
  Modal.setAppElement("#root")
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
    console.log("resetting in play")
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
      if(playerChoice != "spectate" && !creating){
        let res = await fetch(`https://rankedapi-late-cherry-618.fly.dev/gameAPI/players/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            player: ""+playerChoice,
          }),
        })
        if (res.status != 200) {
          valid = false;
          alert("An error occured trying something.");
        }
        res = await res.json();
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
        setStatus(res[0]);
        sessionStorage.setItem("game", JSON.stringify(res[0]))
        id = res[0]._id;
      }
      if(!valid){
        return; // don't go any further
      }
      setCookie("player", ""+playerChoice+" game "+id);
      setChoosing(false);
      setReadying(false);
      navigate(id);
      window.location.reload();
    }
    const createGame = async() => {
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
      marginTop: 300,
      fontFamily: "Roboto Mono"
    };
    return (
      <div>
        {console.log("testv2 performace")}
        {typeof cookies.player == "undefined" ? null : (
          <p style={{ fontSize: 20, color: "blue" }}>
            You are currently in the middle of a game.
          </p>
        )}
        <div style={centerStyle}>
          <h1 style={{ fontSize: 65 }}>Welcome to Genshin Ranked!</h1>
          <p style={{ fontSize: 50 }}>
            Click to start a new game or join an existing one!
          </p>
          <button style={{ fontSize: 40, marginTop: 10 }} onClick={createGame}>
            New Game
          </button>
          <button style={{ fontSize: 40, marginTop: 10 }} onClick={join}>
            Join existing game
          </button>
          <button
            style={{ fontSize: 40, marginTop: 10 }}
            onClick={() => {
              removeCookie("player");
              forceRefresh();
            }}
          >
            Quit existing game
          </button>
          <Modal
            isOpen={open}
            onRequestClose={close}
            contentLabel="Finding a game"
            className="Modal"
          >
            <h1 style={{ color: "white" }}>Current games:</h1>
            {activeGames.map((game) => {
              return (
                <div
                  key={game._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    color: "white",
                  }}
                >
                  <button
                    style={{ fontSize: 18, width: 150 }}
                    onClick={async () => {
                      await playGame(game._id);
                    }}
                  >
                    ID {game._id}
                  </button>
                  <p style={{ fontSize: 18 }}>
                    {" (current status: " + game.result + ")"}
                  </p>
                </div>
              );
            })}
            <div>
              <button
                disabled={refreshing}
                style={{
                  width: 250,
                  fontSize: 22,
                  color: "red",
                }}
                onClick={async () => {
                  refreshGames();
                  let gameData = await fetch(
                    "https://rankedapi-late-cherry-618.fly.dev/gameAPI/active",
                    {
                      method: "GET",
                    }
                  );
                  gameData = await gameData.json();
                  setActive(gameData[0]);
                }}
              >
                {refreshing ? "Please Wait" : "Refresh"}
              </button>
              <button
                style={{
                  width: 250,
                  fontSize: 22,
                  color: "blue",
                }}
                onClick={close}
              >
                Exit
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={choosing}
            onRequestClose={close}
            contentLabel="Choosing what player"
            className="Modal"
          >
            {readying ? <p>Loading your game... You will be automatically redirected!</p> : <div>
              <h1 style={{ color: "white" }}>Choose the player:</h1>
              <button
                style={{
                  width: 200,
                  height: 50,
                  marginLeft: 100,
                  marginTop: 35,
                }}
                onClick={() => choosePlayer("1", status._id)}
                disabled={
                  typeof status.connected != "undefined" &&
                  status.connected[0] == 1
                    ? true
                    : false
                }
              >
                Player 1
              </button>
              <button
                style={{ width: 200, height: 50, marginLeft: 100 }}
                onClick={() => choosePlayer("2", status._id)}
                disabled={
                  typeof status.connected != "undefined" &&
                  status.connected[1] == 1
                    ? true
                    : false
                }
              >
                Player 2
              </button>
              <button
                style={{ width: 200, height: 50, marginLeft: 100 }}
                onClick={() => choosePlayer("ref", status._id)}
                disabled={
                  typeof status.connected != "undefined" &&
                  status.connected[2] == 2
                    ? true
                    : false
                }
              >
                Ref
              </button>
              <button
                style={{ width: 200, height: 50, marginLeft: 100 }}
                onClick={() => choosePlayer("spectate", status._id)}
              >
                Spectate
              </button>
              <button
                style={{ width: 200, height: 50, marginLeft: 100 }}
                onClick={() => {
                  setChoosing(false); // stop choosing and remove game information
                  setStatus({ connected: [0, 0, 0] }); // back to default
                  sessionStorage.removeItem("game");
                }}
              >
                Exit
              </button>
            </div>}
          </Modal>
        </div>
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