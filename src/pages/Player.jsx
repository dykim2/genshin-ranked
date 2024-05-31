import { useContext, useState } from "react"
import {useCookies, withCookies, Cookies} from "react-cookie";
import { useNavigate } from "react-router-dom";
import PlayingContext from "../contexts/PlayingContext";

export default function Player() {
  // the actual player interface
  /*
    concerns:
    1) I will need a timer. 30 seconds to select a pick, 30 seconds to select a ban (both from dropdown menus)
    2) How do I get the page to update on its own? I could set up an auto refresh, but that would not cut it.

    solutions:
    1) https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9
    2) websockets! Plus some funky stuff with local storage and cookies



    more rambling v2 will delete
    I want to have it so one website user presses a button. This then updates my API.
    Once my API is updated, I want to refresh data so the other player sees this update as well.
    Attempt #2: using a context
    Once I get past a certain number, I will just ask on reddit. 

    Using cookies:
    Have the play page work for both players. Using cookies, I can create some small changes between players, so both players see the same thing, just 
    each player can choose on their own. 
  */
  const [player, setPlayer] = useState(1); // 1 or 2, for player 1 or 2
  const [chars, setChars] = useState([]);
  const [cookies, setCookie] = useCookies(["player"]); // need to build with scaling in mind.
  const socket = new WebSocket("https://rankedwebsocketapi.fly.dev/");
  const [playInfo, setInfo] = useContext(PlayingContext);
  // use a context and use a state variable to update the context on each end, with the context holding the game information
  const navi = useNavigate();
  const update = () => {
    // check
    navi("/redirect");
  };
  const trySockets = () => {};
  // Connection opened
  socket.addEventListener("open", function (event) {
    console.log("connected to server");
  });

  // Listen for messages
  socket.addEventListener("message", function (event) {
    console.log(JSON.parse(event.data));
    // initial setup / get call should return the information
    // send props when navigating
  });
  socket.addEventListener("close", function(event) {
    console.log(event.data);
    // throw an error that connection closed?
  })
  socket.addEventListener("error", function(event) {
    console.log("An error occoured");
    console.log(event.data);
  })
  /*
    more notes
    so i have the player click on a button to play the game. 
    once they do, they are assigned a cookie after redirecting. this cookie stays in the browser. 
  */
  // add background image in style
  return (
    <div style={{ color: "white" }}>
      <p>Welcome! </p>
      <p>You are player {cookies.player}</p>
      <br />
      <button onClick={update}>Set a cookie!</button>
      {cookies.player == 1 ? (
        <p style={{ fontSize: "18px" }}>Welcome player 1!</p>
      ) : (
        <p style={{ fontSize: "18px" }}>Hi player 2!</p>
      )}
      {}
      <div style={{ marginLeft: 100, fontSize: 60 }}>
        <button style={{ fontSize: 60 }} onClick={trySockets}>
          Try me
        </button>
        <p>Picks team 1</p>
      </div>
      <button style={{}}></button>
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
 2) Use cookies and redirect to determine what each person sees; to keep the screen consistently up to date from different endpoints, use websockets. 
 I could combine a context with a state variable.
 Finished games will be updated on a button press. 
*/