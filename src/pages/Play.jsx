import { useState, useEffect, useContext } from "react";
import './css/Playing.css';
import { Cookies, useCookies } from "react-cookie";
import Modal from "react-modal";
import IdentityContext from "../contexts/IdentityContext";
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

export default function Play(){
  Modal.setAppElement("#root")
  const [refreshing, setRefresh] = useState(false); // for a refresh games option
  const [activeGames, setActive] = useState([]);
  const [open, setOpen] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["player"]);
  const [exists, setExists] = useState([]);
  const [, forceRefresh] = useState(); // refreshes the page
  const [identity, setIdentity] = useContext(IdentityContext);
  // const []
  const refreshGames = () => {
    setRefresh(true);
    setTimeout(() => {setRefresh(false)}, 10000) // wait 10 seconds between refreshes 
  };
  useEffect( () => {
    async function findActive() {
      let gameData = await fetch(
        "https://rankedapi-late-cherry-618.fly.dev/gameAPI/active",
        {
          method: "GET",
        }
      );
      setActive(await gameData.json());
    }
  findActive();
  }, [refreshing])
    const playGame = (id) => {
      setOpen(false);
      setChoosing(true);
      // call api to see if a player 1 / 2 / ref exists
      fetch(`https://rankedapi-late-cherry-618.fly.dev/gameAPI/find/${id}`)
        .then((res) => res.json())
        .then((data) => {
          // obtain the player information
          data.connected;
        });
    }
    const close = () => {
      setOpen(false);
    }
    const join = () => {
      setOpen(true);
    }
    const quit = () => {
      
    }
    const player1 = () => {
      setCookie("player", "1");
    }
    const player2 = () => {
      setCookie("player", "2");
    }
    const ref = () => {
      setCookie("player", "ref");
    }
    const spectate = () => {
      setCookie("player", "spectate");
    }
    const joinAGame = () => {

    }
    const createGame = () => {
      // create the game here
      /*

      */
    }
    const centerStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      whitespace: 'pre-line',
      flexDirection: "column",
      marginTop: 300
    };
    return (
      <div>
        {
          cookies.player == "" ? null : <p style={{fontSize: 20, color: "blue"}}>You are currently in the middle of a game.</p>
        }
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
          <button style={{ fontSize: 40, marginTop: 10 }} onClick={() => {removeCookie("player"); forceRefresh();}}>Quit existing game</button>
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
                    style={{ fontSize: 22, width: 150 }}
                    onClick={() => {
                      playGame(game._id);
                    }}
                  >
                    ID {game._id}
                  </button>
                  <p style={{ fontSize: 22 }}>
                    {" (current status:" + game.result + ")"}
                  </p>
                </div>
              );
            })}
            <div>
              <button
                disabled={refreshing}
                style={{ width: 200, fontSize: 22, color: "red" }}
                onClick={refreshGames}
              >
                {refreshing ? "Please Wait" : "Refresh"}
              </button>
              <button
                style={{ width: 200, fontSize: 22, color: "blue" }}
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
            <h1 style={{ color: "white" }}>Choose the player:</h1>
            <button
              style={{ width: 200, height: 50, marginLeft: 100, marginTop: 35 }}
              onClick={player1}
            >
              Player 1
            </button>
            <button
              style={{ width: 200, height: 50, marginLeft: 100 }}
              onClick={player2}
            >
              Player 2
            </button>
            <button
              style={{ width: 200, height: 50, marginLeft: 100 }}
              onClick={ref}
            >
              Ref
            </button>
            <button
              style={{ width: 200, height: 50, marginLeft: 100 }}
              onClick={spectate}
            >
              Spectate
            </button>
            <button
              style={{ width: 200, height: 50, marginLeft: 100 }}
              onClick={() => {
                setChoosing(false);
              }}
            >
              Exit
            </button>
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