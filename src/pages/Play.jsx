import {Button, Row} from "react-bootstrap";
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

import {Cookies} from "react-cookie";
export default function Play(){
    const draft = () => {
        alert("draft time");
    }
    const blind = () => {
        alert("blind pick.");
    }
    const playGame = () => {
      
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
        <div style={centerStyle}>
          <h1 style={{ fontSize: 65 }}>Welcome to Genshin Ranked!</h1>
          <p style={{ fontSize: 50 }}>
            As a referee, click to start a new game!
          </p>
          <button style={{ fontSize: 40, marginTop: 10 }} onClick={createGame}>New Game</button>
          <button style={{ fontSize: 40, marginTop: 10 }}>Join existing game</button>
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



 question is how i plan to update each user's screen at the same time. Hence why I just plan to consolidate it to one page that ideally I can update between different screens.
*/